import React, { useState } from "react";
import { Checkbox, Form, FormCheckbox } from "semantic-ui-react";

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const Search = () => {
  const [userInput, setUserInput] = useState();
  const [anime, setAnime] = useState();
  const [character, setCharacter] = useState();
  const [quote, setQuote] = useState();
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSearch = (e) => {
    setUserInput(e.target.value);
  };
  const handleOnChange = (e) => {
    if (status == 0) setStatus(1);
    else setStatus(0);
    console.log(status);
  };
  const handleRandom = () => {
    setLoading(true);
    console.log(loading); //TODO: LOADING DOESNT WORK CORRECTLY ON RANDOM, FIND THE WAY TO FIX
    fetch("https://animechan.vercel.app/api/random")
      .then((res) => res.json())
      .then((quotes) => {
        setAnime(quotes.anime);
        setCharacter(quotes.character);
        setQuote(quotes.quote);
      })
      .finally(setLoading(false));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (status === 0) {
      setLoading(true);
      fetch(`https://animechan.vercel.app/api/quotes/anime?title=${userInput}`)
        .then((res) => res.json())
        .then((quotes) => {
          if (quotes.error) {
            setError(quotes.error);
          } else {
            let tmp = getRandom(0, 9);
            setAnime(quotes[tmp].anime);
            setCharacter(quotes[tmp].character);
            setQuote(quotes[tmp].quote);
            setError(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      fetch(
        `https://animechan.vercel.app/api/quotes/character?name=${userInput}`
      )
        .then((res) => res.json())
        .then((quotes) => {
          if (quotes.error) {
            setError(quotes.error);
          } else {
            let tmp = getRandom(0, 9);
            setAnime(quotes[tmp].anime);
            setCharacter(quotes[tmp].character);
            setQuote(quotes[tmp].quote);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <section>
        <div className="wrap">
          <div className="search">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Input
                  type="text"
                  className="searchTerm"
                  placeholder="Who are you looking for?"
                  onChange={handleSearch}
                  onSubmit={handleSubmit}
                />
                <div id="boxes">
                  <div className="ui radio checkbox">
                    <input
                      type="radio"
                      name="type"
                      onChange={handleOnChange}
                      checked={!status}
                    />
                    <label>anime</label>
                  </div>
                  <div className="ui radio checkbox">
                    <input
                      type="radio"
                      name="type"
                      onChange={handleOnChange}
                      checked={status}
                    />
                    <label>character</label>
                  </div>
                </div>
              </Form.Group>
            </Form>
          </div>
          <button id={"random"} onClick={handleRandom}>
            random
          </button>
        </div>
      </section>
      <section>
        {loading ? <p id={"loader"}>loading</p> : ""}
        <div className="quote">
          <p>{anime}</p>
          <p>{character}</p>
          <p>{quote}</p>
        </div>
      </section>
    </>
  );
};
export default Search;
