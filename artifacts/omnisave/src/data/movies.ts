export interface Movie {
  id: number
  title: string
  date: string
  type: 'MOVIES' | 'TV SERIES' | 'ANIMATION'
  rating: number
  genres: string[]
  color: string
}

export const allMovies: Movie[] = [
  { id: 1,  title: 'The Expendables 2',    date: '2012-08-17', type: 'MOVIES',    rating: 6.6, genres: ['Action','Adventure','Thriller'],       color: '#0d2035' },
  { id: 2,  title: 'The Expendables 3',    date: '2014-08-15', type: 'MOVIES',    rating: 6.1, genres: ['Action','Adventure','Comedy'],          color: '#1a0d2e' },
  { id: 3,  title: 'The Expendables 4',    date: '2023-09-22', type: 'MOVIES',    rating: 5.6, genres: ['Action','Thriller'],                    color: '#2a0d0d' },
  { id: 4,  title: 'The Expendables',      date: '2010-08-13', type: 'MOVIES',    rating: 6.4, genres: ['Action','Adventure','Thriller'],       color: '#0d1535' },
  { id: 5,  title: 'They Were Expendable', date: '1945-12-20', type: 'MOVIES',    rating: 7.2, genres: ['Drama','War'],                          color: '#1a150d' },
  { id: 6,  title: 'Catch the Bullet',     date: '2021-09-03', type: 'MOVIES',    rating: 5.0, genres: ['Action','Western'],                    color: '#1a1a0d' },
  { id: 7,  title: 'Long Game',            date: '2024-04-12', type: 'MOVIES',    rating: 6.9, genres: ['Drama','Sport'],                       color: '#0d1f15' },
  { id: 8,  title: 'Expendable',           date: '2019-03-05', type: 'MOVIES',    rating: 4.8, genres: ['Action','Thriller'],                    color: '#1f150d' },
  { id: 9,  title: 'Vendetta',             date: '2022-06-21', type: 'MOVIES',    rating: 5.4, genres: ['Action','Crime'],                      color: '#200d0d' },
  { id: 10, title: 'Black Adam',           date: '2022-10-21', type: 'MOVIES',    rating: 6.3, genres: ['Action','Fantasy','Sci-Fi'],            color: '#0d0d20' },
  { id: 11, title: 'John Wick 4',          date: '2023-03-24', type: 'MOVIES',    rating: 7.7, genres: ['Action','Thriller','Crime'],            color: '#0d1520' },
  { id: 12, title: 'Fast X',              date: '2023-05-19', type: 'MOVIES',    rating: 5.9, genres: ['Action','Adventure'],                   color: '#200d15' },

  { id: 13, title: 'The Traitors S1-S4',  date: '2022-11-14', type: 'TV SERIES', rating: 7.7, genres: ['Game Show','Reality TV'],               color: '#1a100d' },
  { id: 14, title: 'The Climb',           date: '2023-01-12', type: 'TV SERIES', rating: 6.8, genres: ['Game Show','Reality TV'],               color: '#0d1520' },
  { id: 15, title: 'The Cape',            date: '2011-01-09', type: 'TV SERIES', rating: 6.3, genres: ['Action','Crime','Drama'],               color: '#200d0d' },
  { id: 16, title: 'The Vietnam War',     date: '2017-09-17', type: 'TV SERIES', rating: 9.1, genres: ['Documentary','History','War'],          color: '#0d1a10' },
  { id: 17, title: 'The Method',          date: '2005-02-18', type: 'TV SERIES', rating: 5.2, genres: ['Drama','Thriller'],                    color: '#15100d' },
  { id: 18, title: 'Breaking Bad',        date: '2008-01-20', type: 'TV SERIES', rating: 9.5, genres: ['Drama','Crime','Thriller'],            color: '#1a1a0d' },
  { id: 19, title: 'The Crown',           date: '2016-11-04', type: 'TV SERIES', rating: 8.7, genres: ['Drama','History','Biography'],         color: '#0d0d1a' },
  { id: 20, title: 'Stranger Things',     date: '2016-07-15', type: 'TV SERIES', rating: 8.7, genres: ['Drama','Fantasy','Horror'],            color: '#100d1a' },
  { id: 21, title: 'The Last of Us',      date: '2023-01-15', type: 'TV SERIES', rating: 8.8, genres: ['Drama','Action','Sci-Fi'],             color: '#0d1a0d' },
  { id: 22, title: 'House of the Dragon', date: '2022-08-21', type: 'TV SERIES', rating: 8.5, genres: ['Action','Adventure','Fantasy'],        color: '#200a0a' },

  { id: 23, title: 'Spider-Man: Across the Spider-Verse', date: '2023-06-02', type: 'ANIMATION', rating: 8.6, genres: ['Animation','Action','Adventure'], color: '#0d1530' },
  { id: 24, title: 'Elemental',           date: '2023-06-16', type: 'ANIMATION', rating: 6.8, genres: ['Animation','Adventure','Fantasy'],     color: '#2a150d' },
  { id: 25, title: 'Puss in Boots 2',     date: '2022-12-21', type: 'ANIMATION', rating: 7.9, genres: ['Animation','Action','Comedy'],         color: '#1a0d0d' },
  { id: 26, title: 'The Super Mario Bros Movie', date: '2023-04-05', type: 'ANIMATION', rating: 7.1, genres: ['Animation','Action','Adventure'], color: '#1a0d1a' },
  { id: 27, title: 'Turning Red',         date: '2022-03-11', type: 'ANIMATION', rating: 7.0, genres: ['Animation','Comedy','Family'],         color: '#200d15' },
  { id: 28, title: 'Encanto',             date: '2021-11-24', type: 'ANIMATION', rating: 7.2, genres: ['Animation','Family','Musical'],        color: '#0d1f15' },
  { id: 29, title: 'Attack on Titan',     date: '2013-04-07', type: 'ANIMATION', rating: 9.0, genres: ['Animation','Action','Drama'],          color: '#200d0d' },
  { id: 30, title: 'Demon Slayer',        date: '2019-04-06', type: 'ANIMATION', rating: 8.7, genres: ['Animation','Action','Fantasy'],        color: '#15100d' },
  { id: 31, title: 'One Piece Film: Red', date: '2022-08-06', type: 'ANIMATION', rating: 7.3, genres: ['Animation','Action','Adventure'],      color: '#200a15' },
  { id: 32, title: 'Jujutsu Kaisen 0',   date: '2021-12-24', type: 'ANIMATION', rating: 7.9, genres: ['Animation','Action','Fantasy'],        color: '#0d0d20' },
]

export const movies = allMovies.filter(m => m.type === 'MOVIES')
export const series = allMovies.filter(m => m.type === 'TV SERIES')
export const animation = allMovies.filter(m => m.type === 'ANIMATION')
