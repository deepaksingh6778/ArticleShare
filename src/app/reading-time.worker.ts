addEventListener('message', ({ data }) => {
  const content = data.content || '';
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  // reading speed = 200 WPM
  const minutes = wordCount / 200;

  let readingTime = '';

  if (minutes < 1) {
    const seconds = Math.ceil(minutes * 60);
    readingTime = `${seconds} sec`;
  } else {
    readingTime = `${Math.ceil(minutes)} min`;
  }

  postMessage({ wordCount, readingTime });
});
