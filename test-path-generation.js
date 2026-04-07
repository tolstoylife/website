function normalizeFolderName(name) {
  if (!name) return 'uncategorized';
  return name
    .toLowerCase()
    .replace(/[\s/]+/g, '-')  // spaces and slashes → dashes
    .replace(/['"]/g, '');     // remove quotes
}

const testData = [
  { main: 'Fiction', sub: 'Novels', id: 'anna-karenina', title: 'Anna Karenina' },
  { main: 'Non-Fiction', sub: 'Treatises', id: 'the-kingdom-of-god-is-within-you', title: 'The Kingdom of God Is Within You' },
  { main: 'Plays', sub: 'Drama', id: 'the-power-of-darkness', title: 'The Power of Darkness' },
  { main: 'Poetry and Songs', sub: 'Poetry/Songs', id: 'volga-bogatyr', title: 'Volga-bogatyr' },
  { main: 'Unfinished', sub: 'Unfinished', id: 'the-decembrists', title: 'The Decembrists' },
];

testData.forEach(row => {
  const main = normalizeFolderName(row.main);
  const sub = normalizeFolderName(row.sub);
  const path = `${main}/${sub}/${row.id}/${row.title}.md`;
  console.log(`${row.id}: ${path}`);
});
