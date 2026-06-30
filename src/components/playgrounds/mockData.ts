export const mockData = [
  { id: 1, title: 'Beetlejuice', year: '1988', director: 'Tim Burton' },
  { id: 2, title: 'Ghostbusters', year: '1984', director: 'Ivan Reitman' },
  { id: 3, title: 'The Matrix', year: '1999', director: 'Lana Wachowski' },
  { id: 4, title: 'Inception', year: '2010', director: 'Christopher Nolan' },
  { id: 5, title: 'Interstellar', year: '2014', director: 'Christopher Nolan' },
  { id: 6, title: 'The Dark Knight', year: '2008', director: 'Christopher Nolan' },
  { id: 7, title: 'Pulp Fiction', year: '1994', director: 'Quentin Tarantino' },
  { id: 8, title: 'Fight Club', year: '1999', director: 'David Fincher' },
  { id: 9, title: 'Forrest Gump', year: '1994', director: 'Robert Zemeckis' },
  { id: 10, title: 'The Shawshank Redemption', year: '1994', director: 'Frank Darabont' }
];

export const mockColumns = [
  { name: 'Title', selector: (row: any) => row.title, sortable: true, id: 'title' },
  { name: 'Director', selector: (row: any) => row.director, sortable: true, id: 'director' },
  { name: 'Year', selector: (row: any) => row.year, sortable: true, id: 'year' }
];
