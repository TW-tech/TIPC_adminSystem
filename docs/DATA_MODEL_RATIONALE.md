# Article Content System - Data Model Rationale

## Core Design Decisions

### 1. **Block-Based Architecture with Separate Table**

**Why?**
- **Independent Editability**: Each block is a separate database row. Updating one block requires only a single UPDATE query with a WHERE id clause
- **Simple Reordering**: Moving blocks up/down only changes position integers, not content
- **Granular Versioning**: Easy to add block-level history tracking later
- **Type Safety**: JSON data field combined with BlockType enum allows type-specific structures without table bloat

**Alternative Rejected**: Storing all blocks as a JSON array in Article table would require:
- Deserializing entire array for single block edit
- Complex validation logic
- No database-level constraints on block structure
- Difficult to query individual blocks

### 2. **Annotations Stored at Article Level (Not in Blocks)**

**Why?**
- **Reference Integrity**: All annotations in one place makes validation simple: "Does every marker [1], [2] have a corresponding annotation?"
- **No Cross-Block Logic**: Adding/editing/deleting an annotation doesn't require scanning or updating multiple text blocks
- **Maintainability**: Annotations form a separate list at the bottom of the article. This matches the mental model and makes CRUD operations straightforward
- **Validation**: Single query to verify all reference markers are satisfied

**How It Works**:
```typescript
// Text blocks and image captions can both contain reference markers
Text block content: "This is a fact[1] and another claim[2]."
Image block caption: "Photo taken in 2024[3]"

Annotations table:
  - marker: "1", text: "Source: Scientific Journal..."
  - marker: "2", text: "Source: Government Report..."
  - marker: "3", text: "Photo credit: John Doe..."
```
  - marker: "1", text: "Source: Scientific Journal..."
  - marker: "2", text: "Source: Government Report..."
```

**Alternative Rejected**: Storing annotations inside text block data would:
- Require parsing text content to find which annotations are used
- Make annotation reuse impossible
- Complicate annotation management UI
- Break normalization principles

### 3. **Position-Based Ordering**

**Why?**
- **O(1) Reordering**: To move a block from position 5 to position 2, just renumber positions 2-5
- **Simple Queries**: `SELECT * FROM blocks WHERE articleId = ? ORDER BY position`
- **No Linked Lists**: No prev/next pointers that break on deletes
- **Gap Tolerance**: Positions can have gaps (0, 10, 20...) for future insertions without renumbering

**Alternative Rejected**: Linked list approach (prev/next IDs) requires:
- Multiple updates per reorder
- Complex query to reconstruct order
- Broken chains on deletion

### 4. **JSON Data Field for Block Content**

**Why?**
- **Type-Specific Structure**: Text blocks need `content`, image blocks need `src/alt/caption`, quote blocks need `text/author/source`
- **No Sparse Tables**: Avoids 20+ nullable columns for different block types
- **Schema Evolution**: Adding new fields to a block type doesn't require migration
- **Type Safety**: TypeScript discriminated unions provide compile-time type checking

**Validation**: Application layer validates JSON structure against TypeScript types before save

### 5. **Optional One-to-One Video/Podcast Relations**

**Why?**
- **Optional Features**: Most articles won't have video/podcast, separate tables avoid NULL columns
- **Rich Metadata**: Each media type has specific fields (duration, thumbnailUrl, etc.) without bloating Article table
- **Query Efficiency**: `SELECT * FROM articles WHERE video IS NOT NULL` is fast with proper indexing
- **Independent Lifecycle**: Can add/remove media without touching article content

**Alternative Rejected**: Storing video/podcast URLs directly in Article table:
- Wastes space (most articles don't have media)
- Can't store rich metadata
- Mixing concerns in Article table

### 6. **Cascade Deletes**

**Why?**
- **Data Integrity**: When an article is deleted, all blocks, annotations, and media must be deleted
- **Automatic Cleanup**: Database handles cascading automatically, no orphaned records
- **Transactional**: Delete operation is atomic

## Editability Examples

### Edit Single Block
```typescript
// Only touches one row
await prisma.articleBlock.update({
  where: { id: blockId },
  data: { data: { content: "Updated text[1]" } }
});
```

### Reorder Blocks
```typescript
// Move block from position 5 to position 2
await prisma.$transaction([
  // Shift positions 2-4 down
  prisma.articleBlock.updateMany({
    where: { articleId, position: { gte: 2, lt: 5 } },
    data: { position: { increment: 1 } }
  }),
  // Move block to position 2
  prisma.articleBlock.update({
    where: { id: blockId },
    data: { position: 2 }
  })
]);
```

### Add Annotation (No Block Updates Needed)
```typescript
await prisma.articleAnnotation.create({
  data: {
    articleId,
    marker: "3",
    text: "New citation...",
    position: 2
  }
});
// Text blocks with [3] markers already work!
```

### Validate Reference Integrity
```typescript
// Get all markers from text blocks
const blocks = await prisma.articleBlock.findMany({
  where: { articleId, type: 'text' }
});
const markers = extractMarkersFromTextBlocks(blocks); // ["1", "2", "3"]

// Check all markers have annotations
const annotations = await prisma.articleAnnotation.findMany({
  where: { articleId }
});
const annotationMarkers = annotations.map(a => a.marker); // ["1", "2"]

const missing = markers.filter(m => !annotationMarkers.includes(m)); // ["3"]
if (missing.length > 0) {
  throw new Error(`Missing annotations for markers: ${missing.join(", ")}`);
}
```

## Maintainability Benefits

1. **Clear Separation of Concerns**: Content (blocks), references (annotations), metadata (article), media (video/podcast) all in separate tables
2. **Easy to Test**: Each entity can be unit tested independently
3. **Simple Migrations**: Adding new block types only requires updating the enum and application logic
4. **Predictable Queries**: No complex joins required for basic operations
5. **Type Safety**: TypeScript ensures compile-time correctness, Prisma ensures runtime correctness

## What This Model Does NOT Include

- User management / authorship (separate concern)
- Comments / reactions (separate feature)
- Categories / tags (separate feature)
- SEO metadata (can be added to Article table)
- Localization / translations (separate feature)
- Revision history (separate feature)
- Draft vs published state (can add `status` enum to Article)

This model focuses exclusively on **article content structure** with emphasis on editability and reference integrity.
