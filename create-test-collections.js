#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// 5 new collections to create
const newCollections = [
  'performance-docs',
  'security-guides', 
  'api-reference',
  'tutorials-hub',
  'best-practices'
];

// Template for generating MDX content
const generateContent = (title, collection, category, index, depth = 0) => {
  const indent = '  '.repeat(depth);
  
  return `---
title: "${title}"
description: "Documentation for ${title} in ${collection}"
category: "${category}"
order: ${index}
---

# ${title}

This is page ${index} in the ${collection} collection under the ${category} category.

## Overview

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Code Example

\`\`\`javascript
// Example for ${title}
function ${title.toLowerCase().replace(/[^a-z0-9]/g, '')}Example() {
  const config = {
    name: "${title}",
    collection: "${collection}",
    category: "${category}",
    index: ${index}
  };
  
  console.log("Initializing:", config.name);
  return config;
}

// Usage
const example = ${title.toLowerCase().replace(/[^a-z0-9]/g, '')}Example();
console.log(example);
\`\`\`

## Configuration

\`\`\`json
{
  "name": "${title.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "collection": "${collection}",
  "category": "${category}",
  "settings": {
    "enabled": true,
    "debug": false,
    "timeout": 5000
  }
}
\`\`\`

## Features

${indent}- Feature 1: Advanced ${category} capabilities
${indent}- Feature 2: Integration with ${collection}
${indent}- Feature 3: Customizable configuration
${indent}- Feature 4: Performance optimizations
${indent}- Feature 5: Error handling and logging

## Usage Examples

### Basic Usage

\`\`\`typescript
import { ${title.replace(/[^a-zA-Z0-9]/g, '')} } from './${title.toLowerCase().replace(/\s+/g, '-')}';

const instance = new ${title.replace(/[^a-zA-Z0-9]/g, '')}({
  collection: "${collection}",
  category: "${category}"
});

await instance.initialize();
const result = await instance.execute();
\`\`\`

### Advanced Usage

\`\`\`typescript
// Advanced configuration
const options = {
  collection: "${collection}",
  category: "${category}",
  advanced: {
    caching: true,
    retries: 3,
    timeout: 10000,
    middleware: [
      (data) => validateInput(data),
      (data) => transformData(data),
      (data) => logData(data)
    ]
  }
};

const instance = new ${title.replace(/[^a-zA-Z0-9]/g, '')}(options);
\`\`\`

## API Reference

### Methods

#### \`initialize(options?)\`

Initializes the ${title.toLowerCase()} with optional configuration.

**Parameters:**
- \`options\` (Object, optional): Configuration options

**Returns:** \`Promise<void>\`

#### \`execute(data?)\`

Executes the main functionality.

**Parameters:**
- \`data\` (any, optional): Input data to process

**Returns:** \`Promise<Result>\`

#### \`cleanup()\`

Performs cleanup operations.

**Returns:** \`Promise<void>\`

### Events

- \`ready\`: Emitted when initialization is complete
- \`data\`: Emitted when data is processed
- \`error\`: Emitted when an error occurs
- \`complete\`: Emitted when execution is finished

## Best Practices

1. **Always initialize before use**: Call \`initialize()\` before executing any operations
2. **Handle errors gracefully**: Implement proper error handling for all async operations
3. **Use appropriate timeouts**: Configure timeouts based on your use case
4. **Clean up resources**: Call \`cleanup()\` when done to free resources
5. **Monitor performance**: Use built-in metrics to track performance

## Troubleshooting

### Common Issues

**Issue: Initialization fails**
- Check configuration parameters
- Verify required dependencies are installed
- Ensure proper permissions

**Issue: Timeout errors**
- Increase timeout value in configuration
- Check network connectivity
- Verify server availability

**Issue: Memory leaks**
- Call \`cleanup()\` method when done
- Avoid creating multiple instances unnecessarily
- Monitor memory usage in production

## Related Documentation

- [${collection} Overview](../index)
- [${category} Guide](../${category.toLowerCase().replace(/\s+/g, '-')}/index)
- [API Reference](../api/index)
- [Examples](../examples/index)

## Changelog

### Version 1.0.0
- Initial implementation
- Basic ${category.toLowerCase()} functionality
- Configuration support
- Error handling

---

*Last updated: ${new Date().toISOString().split('T')[0]}*
*Collection: ${collection}*
*Category: ${category}*
*Page: ${index}/100*
`;
};

console.log('🚀 Starting generation of 5 new collections with 100 pages each...\n');

// Generate each collection
newCollections.forEach((collection, collectionIndex) => {
  console.log(`📁 Creating collection: ${collection}`);
  
  // Create main collection directory
  const collectionDir = join('content', collection);
  mkdirSync(collectionDir, { recursive: true });
  
  // Create collection index
  const collectionIndexContent = `---
title: "${collection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}"
description: "Complete documentation for ${collection}"
---

# ${collection.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}

Welcome to the ${collection} documentation. This collection contains comprehensive guides, tutorials, and reference materials.

## Overview

This collection is organized into several categories to help you find the information you need quickly.

## Categories

- **Getting Started**: Basic concepts and setup instructions
- **Guides**: Step-by-step tutorials and how-to guides  
- **Reference**: Detailed API documentation and specifications
- **Examples**: Practical examples and use cases
- **Advanced**: Advanced topics and best practices

## Quick Start

1. Start with the [Getting Started](./getting-started/index) section
2. Follow the relevant [Guides](./guides/index) for your use case
3. Refer to the [Reference](./reference/index) documentation as needed
4. Check out [Examples](./examples/index) for practical implementations

## Support

If you need help or have questions, please check the troubleshooting sections in each guide or refer to the FAQ.
`;
  
  writeFileSync(join(collectionDir, 'index.mdx'), collectionIndexContent);
  
  // Define categories with different nesting structures
  const categories = [
    { name: 'getting-started', pages: 15, maxDepth: 2 },
    { name: 'guides', pages: 25, maxDepth: 3 },
    { name: 'reference', pages: 30, maxDepth: 2 },
    { name: 'examples', pages: 20, maxDepth: 3 },
    { name: 'advanced', pages: 10, maxDepth: 4 }
  ];
  
  let pageCounter = 1;
  
  categories.forEach(category => {
    console.log(`  📂 Creating category: ${category.name} (${category.pages} pages)`);
    
    const categoryDir = join(collectionDir, category.name);
    mkdirSync(categoryDir, { recursive: true });
    
    // Create category index
    const categoryIndexContent = generateContent(
      `${category.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Overview`,
      collection,
      category.name,
      0
    );
    writeFileSync(join(categoryDir, 'index.mdx'), categoryIndexContent);
    
    // Generate pages for this category
    const pagesPerLevel = Math.ceil(category.pages / category.maxDepth);
    
    for (let depth = 1; depth <= category.maxDepth; depth++) {
      const pagesAtThisDepth = Math.min(pagesPerLevel, category.pages - (depth - 1) * pagesPerLevel);
      
      if (pagesAtThisDepth <= 0) break;
      
      for (let i = 1; i <= pagesAtThisDepth; i++) {
        let currentDir = categoryDir;
        let pathSegments = [category.name];
        
        // Create nested structure based on depth
        if (depth > 1) {
          const subDirName = `level-${depth}`;
          pathSegments.push(subDirName);
          currentDir = join(currentDir, subDirName);
          mkdirSync(currentDir, { recursive: true });
          
          // Create index for subdirectory if it doesn't exist
          const subIndexPath = join(currentDir, 'index.mdx');
          try {
            const subIndexContent = generateContent(
              `Level ${depth} Overview`,
              collection,
              `${category.name}/level-${depth}`,
              0,
              depth - 1
            );
            writeFileSync(subIndexPath, subIndexContent);
          } catch (e) {
            // Index might already exist, that's ok
          }
        }
        
        const pageTitle = `${category.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} ${depth > 1 ? `L${depth} ` : ''}Page ${i}`;
        const fileName = `page-${pageCounter}.mdx`;
        const filePath = join(currentDir, fileName);
        
        const content = generateContent(pageTitle, collection, category.name, pageCounter, depth - 1);
        writeFileSync(filePath, content);
        
        pageCounter++;
      }
    }
  });
  
  console.log(`  ✅ Collection ${collection} completed with ${pageCounter - 1} pages\n`);
});

console.log('🎉 Generation complete!');
console.log(`📊 Summary:`);
console.log(`  - Collections created: ${newCollections.length}`);
console.log(`  - Total pages generated: ~${newCollections.length * 100}`);
console.log(`  - Nesting levels: 2-4 levels deep`);
console.log(`\n📝 Next steps:`);
console.log(`  1. Update src/sources.ts to include the new collections`);
console.log(`  2. Run "pnpm build" to test the build with more pages`);
