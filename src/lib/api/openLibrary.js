const fetchTrendingBooks = async ({ timeframe = "daily" }) => {
  const validTimeframes = ["now", "daily", "weekly", "monthly"];
  if (!validTimeframes.includes(timeframe)) {
    throw new Error(`Invalid timeframe: ${timeframe}`);
  }

  const url = `https://openlibrary.org/trending/${timeframe}.json?limit=30`;
  console.log(url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch trending books for timeframe: ${timeframe}`);
  }

  const data = await response.json();
  return data.works.map((book) => ({
    title: book.title || "Unknown Title",
    image: book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : `https://placehold.co/600x900${book.title ? `?text=${book.title}` : ""}`,
    author: book.author_name ? book.author_name.slice(0,3).join(", ") : "Unknown",
    year_published: book.first_publish_year || "Unknown",
    link: book.key ? `/books/${book.key.replace("/works/", "")}` : "#",
  }));
};

const fetchSearchBooks = async ({ query, limit = 30, offset = 0 }) => {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch search results for query: ${query}`);
  }
  const data = await response.json();

  const fetchRatings = async (key) => {
    const ratingsUrl = `https://openlibrary.org/works/${key}/ratings.json`;
    const ratingsResponse = await fetch(ratingsUrl);
    if (!ratingsResponse.ok) {
      return "No ratings";
    }
    const ratingsData = await ratingsResponse.json();
    return ratingsData.summary ? ratingsData.summary.average : "No ratings";
  };

  const booksWithRatings = await Promise.all(
    data.docs.map(async (book) => {
      const rating = await fetchRatings(book.key.replace("/works/", ""));
      return { ...book, rating };
    })
  );

  return booksWithRatings.map((book) => ({
    key: book.key.replace("/works/", ""),
    title: book.title || "Unknown Title",
    author: book.author_name ? book.author_name.join(", ") : "Unknown",
    cover_i: book.cover_i,
    year_published: book.first_publish_year || "Unknown",
    rating: book.rating,
  }));
};

export { fetchTrendingBooks, fetchSearchBooks };
