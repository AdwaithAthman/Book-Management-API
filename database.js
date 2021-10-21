const books = [
	{
		ISBN: "12345Book",
		title: "Tesla",
		pubDate: "2021-08-05",
		language: "en",
		numPage: 250,
		author: [1,2],
		publications: [1],
		category: ["tech", "space", "education"]
	}
];

const author = [
	{
		id: 1,
		name: "Adwaith",
		books: ["12345Book", "secretBook"]
	},
	{
		id: 2,
		name: "Elon Musk",
		books: ["12345Book"]
	}
];

const publications = [
	{
		id: 1,
		name: "writeX",
		books: ["12345Book", "imaginary54321"]
	},
	{
		id: 2,
		name: "readableS",
		books: ["secretBook", "imaginary54321"]
	}
];

module.exports = {books,author,publications}
