---
description: Database migrations with Prisma and Supabase
---

# Database Migration Skill

Use this skill when making database schema changes.

## Workflow

### 1. Edit Schema
Modify `prisma/schema.prisma`:

```prisma
model NewModel {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  // ... fields
  createdAt DateTime @default(now())
}
```

### 2. Create Migration
```bash
npx prisma migrate dev --name describe_change
```

Example names:
- `add_user_memory`
- `add_habits_table`
- `add_mode_to_messages`

### 3. Generate Client
```bash
npx prisma generate
```

### 4. Verify
```bash
npx prisma studio
```

## Common Operations

### Add Column
```prisma
model User {
  // existing fields
  newField String?  // nullable for existing rows
}
```

### Add Relation
```prisma
model User {
  habits Habit[]
}

model Habit {
  userId String
  user   User @relation(fields: [userId], references: [id])
}
```

### Add Index
```prisma
model Message {
  @@index([userId, createdAt])
}
```

## Prisma Commands Reference
```bash
npx prisma migrate dev      # Dev migration
npx prisma migrate deploy   # Production
npx prisma db push          # Quick schema push (no migration file)
npx prisma studio           # Visual DB editor
npx prisma generate         # Regenerate client
```
