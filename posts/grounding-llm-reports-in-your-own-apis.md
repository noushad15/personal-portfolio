---
title: "Grounding LLM reports in your own APIs"
date: 2026-03-10
description: "How we added LLM-written narrative reports to an analytics platform without letting the model invent a single number."
tags: [llm, rag, analytics, azure]
---

Customers of the hotel-marketing analytics platform I lead already had charts, tables and scheduled PDF reports. What they asked for next was the paragraph a good analyst would write on top: what changed, why, and what to do about it. That is a natural job for a language model, and also the easiest way to ship a product that confidently states numbers which are not true. This post is about how we structured the feature so that every number in a generated narrative can be traced to an API call.

I led this initiative, set the architecture and reviewed the work. Most of the implementation was done by a team member, and the design is better for the arguments we had along the way.

## The constraint

The model must never be the source of a figure. It can summarise, compare and recommend, but every revenue change, every channel share and every scorecard value has to come from the same place the platform's UI gets it. If the narrative says revenue fell by some percentage, a reader must be able to find that exact figure in the product.

That rules out the simplest design, where you paste a data dump into the prompt and ask for prose. It is too easy for a model to round, mis-add, or quietly drop a month.

## The API layer as the tool surface

The platform already had authenticated endpoints for hotel information, period overviews and scorecards. Instead of building a second data path for the model, we exposed those endpoints to it as tools. Three functions wrap the API calls, run with the current user's token, and return the response serialised for the model. The model asks for hotel information, the overview for a date range, or the scorecard for a date, and it gets exactly what the frontend would get.

This has two consequences I like. Permissions are inherited for free: the model cannot see a hotel the user cannot see. And when a figure in the narrative looks wrong, the debugging path is the same as for a wrong figure in a chart.

## Finding the right endpoint

With a growing API, the model needs help choosing which call to make and how to shape it. We embedded the platform's API documentation into Azure AI Search using a small embedding model, and gave the model a search step: compute the embedding for its question once, run a vector query over the documentation index, and use the matching endpoint descriptions to decide which tool to call and with which parameters.

```python
embedding = aoai.embeddings.create(model=EMBEDDING_MODEL, input=query).data[0].embedding
results = search_client.search(
    search_text=query,
    vector_queries=[VectorizedQuery(vector=embedding, k_nearest_neighbors=10, fields="vector")],
)
```

The system prompt, the API instructions and the tool definitions are files in the repository, versioned alongside the code. Changing the model's behaviour is a pull request with a diff, not an edit in a console somewhere.

## From narrative to PDF

The generated text follows a fixed structure: numbered sections with a short title and bullet points, which the prompt asks for explicitly. A parser splits the narrative into those sections and pairs each with the charts generated for it. The result is rendered through the same Jinja templates and WeasyPrint engine that produce the platform's other PDF reports, so an AI narrative looks like every other report the customer receives, with the same header, the same charts and the same footer.

The parser was the surprisingly fiddly part. Models are inconsistent about numbering, and a numbered recommendation inside a section looks a lot like a new section. The fix was a stricter pattern for section headings and validation that the sequence is complete, with a fallback that keeps the text readable even when the structure is off.

## What we got

A report that reads like an analyst wrote it, where every figure is a value the platform already serves, generated through the platform's own permissions. When a customer questions a number, support can point to the endpoint and the date range. That traceability was the point of the design, and it is why I would make the same choice again.

## What I'd do differently

I would build the evaluation set before the feature. We tuned prompts by reading outputs, which works until two people disagree about whether a paragraph is good. A fixed set of hotels and periods with reference narratives, scored on whether every number is present and correct, would have made those conversations shorter and the regressions visible.
