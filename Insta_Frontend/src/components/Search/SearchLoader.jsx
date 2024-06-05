import "./searchLoader.css";
const SearchLoader = () => {
  let arr = [0,1, 2, 3, 4, 5, 6, 7, 8, 9,11,12,13,14];
  return (
    <div className="searchLoader">
      {arr.map((item,i) => {
        return (
          <>
            <div className="searchLoaderCard" key={i}>
              <div style={{animationDelay:`${i*.1}s`}} className="searchLoaderCard1"></div>
              <div className="searchLoaderCard2">
                <p style={{animationDelay:`${i*.1}s`}}></p>
                <p style={{animationDelay:`${i*.1}s`}}></p>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default SearchLoader;
