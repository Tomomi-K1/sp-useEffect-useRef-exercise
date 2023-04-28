import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";


// Part 2: Click to Keep Drawing
// Change the behavior of the app, so that when you click on the button, rather than drawing a single card, the page will draw one card every second.

// These draws will continue until you press the button again, or until the deck has been exhausted (at which point the alert message from Part 1 should appear). Make sure to change the button text appropriately as well (for example, it could toggle between “Start drawing” and “Stop drawing.”

const Deck2 = () => {
    const [deckId, setDeckId] = useState(null);
    const [cardImgs, setCardImgs] = useState([]);
    const [isDrawing, setIsDrawing] =useState(false);
    const timerId = useRef();

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
            clearInterval(timerId.current)
        }
        console.log(res.data.cards[0].image, deckId)
        setCardImgs(cardImgs=>[...cardImgs, res.data.cards[0].image])
        
    }

    const HandleDraw = () => {
        if(!isDrawing){
            
            setIsDrawing(isDrawing => !isDrawing);
            // start calling getCard function every seconds =>useEffect => clean up function to stop the Interval.
            
            timerId.current = setInterval(()=>{
                console.log(timerId)
                getCard(deckId);  
            }, 1000)
            

        } else {
            setIsDrawing(isDrawing => !isDrawing);
            clearInterval(timerId.current)
        }              
        
    }

    return (
        <div>
            <div className="Deck-button">
                <button onClick={HandleDraw}>{isDrawing? "Stop Drawing": "Start Drawing"  }</button>
            </div>
            <div className="Deck-cards">
            {cardImgs.map(img=> <Card src={img} />)}
            </div>
        </div>
    ) 
}

export default Deck2;