const url = 'https://xwuwltrtbwqfcfrzkzjd.supabase.co/rest/v1/works?select=*&limit=1';
const key = 'sb_secret_YgdgZm44sDDwuQ5-00fcAQ_NbBnVilL';

fetch(url, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  },
})
  .then(res => {
    console.log('Status:', res.status);
    return res.text();
  })
  .then(body => console.log(body))
  .catch(err => console.error('Error:', err.message));
