import React from "react";
import type { Pokemon } from "./Main";
import '../index.css';

interface Props {
  item: Pokemon[] | null,
  error: string,
}

class CardList extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {  

    };
  }





  render() {
    const { item: pokemon, error: searchError } = this.props;

    if (searchError) {
      return <p className="error">Error: {searchError}</p>;
    }

    if (!pokemon) {
      return <p>Loading...</p>;
    }
    
    return (
      <div className="card-list">
       <ul className="card-list-content">
          {pokemon.map((el) => (
            <li className="card" key={el.id}>

              <div className="card-image-wrapper">
                <img
                  className="card-image"
                  src={el.image}
                  alt={el.name}
                />
              </div>

              <h2 className="card-name">
                {el.name}
              </h2>

              <div className="card-info">
                <p className="card-text">
                  Height: {el.height}
                </p>

                <p className="card-text">
                  Weight: {el.weight}
                </p>
              </div>

            </li>
          ))}
        </ul>
      </div>
    );

  }
}

export default CardList;