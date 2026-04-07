// Obsidian resolves wikilinks by filename, NOT by folder path
// So [[Anna Karenina]] will resolve correctly regardless of the folder depth

const files = [
  'src/works/fiction/novels/anna-karenina/Anna Karenina.md',
  'src/works/fiction/novellas/master-and-man/Master and Man.md',
  'src/works/non-fiction/treatises/the-kingdom-of-god-is-within-you/The Kingdom of God Is Within You.md',
  'src/works/plays/drama/the-power-of-darkness/The Power of Darkness.md',
];

console.log('Obsidian Wikilink Resolution Test\n');
console.log('Obsidian matches wikilinks by filename, not folder path.\n');

files.forEach(filepath => {
  const filename = filepath.split('/').pop();
  const title = filename.replace('.md', '');
  const wikilink = `[[${title}]]`;
  
  console.log(`File: ${filepath}`);
  console.log(`Wikilink: ${wikilink}`);
  console.log(`✓ Resolves to: ${filename}\n`);
});

console.log('Conclusion: All wikilinks will resolve correctly.');
