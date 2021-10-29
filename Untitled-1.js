<!DOCTYPE html>
<html lang="en">
<head>
  <title>Example</title>
  <!-- Initialize a global WBK function -->
  <script src="https://cdn.rawgit.com/maxlath/wikidata-sdk/dist/dist/wikibase-sdk.min.js"></script>
  <!-- Initialize a global wdk object using the WBK object -->
  <script src="https://cdn.rawgit.com/maxlath/wikidata-sdk/dist/dist/wikidata-sdk.min.js"></script>
</head>


<body>
  <pre id="output"></pre>
  <script>
    query = "SELECT ?compound ?cas WHERE { ?compound wdt:P231 ?cas } LIMIT 10"
    const url = wdk.sparqlQuery(query)
    async function main () {
      const response = await fetch(url)
      const results = await response.json()
      const simpleResults = wdk.simplify.sparqlResults(results)
      document.getElementById('output').innerHTML =
        JSON.stringify(simpleResults, undefined, 2);
    }
    main()
  </script>
</body>
</html>
