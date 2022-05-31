const githubQuery= (
    pageCount, 
    queryString, 
    paginationKeyword,
    paginationString)=> {
    return {
    query:`
    {
        viewer {
          name
        }
        search(query: "${queryString} user:gargmoh sort:updated-asc", type: REPOSITORY, ${paginationKeyword}:${pageCount}, ${paginationString}) {
            repositoryCount
            edges{
                cursor
                node {
                    ... on Repository {
                      id
                      name
                      description
                      url
                      viewerSubscription
                    }
                }
            }
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
         
        }
      }
    `,
  };
}
export default githubQuery;