import github from './db.js';
import {useState, useEffect, useCallback} from 'react'
import query from './Query.js';
import RepoInfo from './RepoInfo';
import SearchBox from './Searchbox';
import NavButton from './NavButton';

function App() {

  let [username, setUserName]= useState("");
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(4);
  let[queryString, setQueryString] = useState("");
  let[totalCount, setTotalCount] = useState(null);


  let[startCursor, setstartCursor] = useState(null);
  let[endCursor, setendCursor] = useState(null);
  let[hasNextPage, sethasNextPage] = useState(true);
  let[hasPreviousPage, sethasPreviousPage] = useState(false);
  let[paginationKeyword, setPaginationKeyword] = useState("first");
  let[paginationString, setPaginationString] = useState("");
  const fetchData = useCallback(() =>{
    const queryText = JSON.stringify(query(pageCount,queryString, paginationKeyword,paginationString))
    fetch(github.baseURL,{
      method:"POST",
      headers:github.headers,
      body: queryText,
    })
    .then(response => response.json())
    .then(data => {
      const viewer= data.data.viewer
      const repos = data.data.search.edges
      const total = data.data.search.repositoryCount
      const start = data.data.search.pageInfo?.startCursor
      const end = data.data.search.pageInfo?.endCursor
      const next = data.data.search.pageInfo?.hasNextPage
      const prev = data.data.search.pageInfo?.hasPreviousPage
      setUserName(viewer.name)
      setRepoList(repos)
      setTotalCount(total)
      setendCursor(end)
      setstartCursor(start)
      sethasNextPage(next)
      sethasPreviousPage(prev)
      console.log(data)
    })
    .catch(err =>{
      console.log(err)
    })
  }, [pageCount, queryString, paginationKeyword,paginationString]);

  useEffect (() =>{
   fetchData();
  },[fetchData])
  return (
    <div className="App container mt-5">
      <h1 className="text-primary text-align-center">
      <i className="bi bi-diagram-2-fill"></i> 
      Github Repos
      </h1>
      <h5>
        Welcome {username} !
      </h5>
      
      <SearchBox
        totalCount={totalCount}
        pageCount={pageCount}
        queryString={queryString}
        onTotalChange={(myNumber) => {
          setPageCount(myNumber);
        }}
        onQueryChange={(myString) => {
          setQueryString(myString);
        }}
      />
      <NavButton 
      start={startCursor} 
      end={endCursor} 
      prev={hasPreviousPage} 
      next={hasNextPage} 
      onPage={(myKeyword, myString)=>{
        setPaginationKeyword(myKeyword)
        setPaginationString(myString)
      }}
      
      />
      { repoList && (
        <ul className="list-group list-group-flush">
          {
            repoList.map((repo) => (
              <RepoInfo key={repo.node.id} repo={repo.node} />
            ))
          }
        </ul>
      )}
      <NavButton 
      start={startCursor} 
      end={endCursor} 
      prev={hasPreviousPage} 
      next={hasNextPage} 
      onPage={(myKeyword, myString)=>{
        setPaginationKeyword(myKeyword)
        setPaginationString(myString)
      }}
      
      />

      
    </div>
  );
}

export default App;
