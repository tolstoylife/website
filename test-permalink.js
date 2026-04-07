// Simulate what Eleventy will do with the permalink

function normalizeFolderName(name) {
  if (!name) return 'uncategorized';
  return name
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/['"]/g, '');
}

const testWorks = [
  { id: 'anna-karenina', mainCategory: 'Fiction', subcategory: 'Novels' },
  { id: 'the-kingdom-of-god-is-within-you', mainCategory: 'Non-Fiction', subcategory: 'Treatises' },
  { id: 'master-and-man', mainCategory: 'Fiction', subcategory: 'Novellas' },
  { id: 'how-much-land-does-a-man-need', mainCategory: 'Fiction', subcategory: 'Short Stories' },
  { id: 'sevastopol-sketches', mainCategory: 'Fiction', subcategory: 'Sketches' },
  { id: 'abc-book', mainCategory: 'Fiction', subcategory: 'Childrens Literature' },
  { id: 'confession', mainCategory: 'Non-Fiction', subcategory: 'Personal Papers' },
  { id: 'what-is-art', mainCategory: 'Non-Fiction', subcategory: 'Essays and Criticism' },
  { id: 'the-school-at-yasnaya-polyana', mainCategory: 'Non-Fiction', subcategory: 'Educational' },
  { id: 'the-power-of-darkness', mainCategory: 'Plays', subcategory: 'Drama' },
  { id: 'the-fruits-of-enlightenment', mainCategory: 'Plays', subcategory: 'Comedy' },
  { id: 'the-decembrists', mainCategory: 'Unfinished', subcategory: 'Unfinished' },
  { id: 'volga-bogatyr', mainCategory: 'Poetry and Songs', subcategory: 'Poetry/Songs' },
];

console.log('Generated URLs (from works.11tydata.json permalink template):\n');

testWorks.forEach(work => {
  const main = normalizeFolderName(work.mainCategory);
  const sub = normalizeFolderName(work.subcategory);
  const url = `/works/${main}/${sub}/${work.id}/`;
  console.log(`${work.id.padEnd(40)} → ${url}`);
});

console.log('\n✓ All URLs generated successfully');
