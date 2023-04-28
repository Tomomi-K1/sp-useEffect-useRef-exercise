import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";



// everytime draw button is clicked, calls API and uses image and keeps remaining.
// when remaining is 0. shows alert msg

const Deck1 = () => {
    const [deckId, setDeckId] = useState(null);
    const [cardImgs, setCardImgs] = useState([]);

    useEffect(() => {
         async function fetchData(){
            const res=await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            setDeckId(res.data.deck_id)
         }
         fetchData();
    }, [])

    async function getCard(deckId){
        const res=await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        
        if(res.data.remaining ===0 ){
            alert("there is no more cards!")
        }
     
        setCardImgs([...cardImgs, res.data.cards[0].image])
        
    }

    return (
        <div>
            <div className="Deck-button">
                <button onClick={()=>getCard(deckId)}>GIMME A CARD</button>
            </div>
            <div className="Deck-cards">
            {cardImgs.map(img=> <Card src={img} />)}
            </div>
        </div>
    ) 
}

export default Deck1;