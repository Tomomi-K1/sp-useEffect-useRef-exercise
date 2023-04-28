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
         async function fetchDeckId(){
            const res=await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            setDeckId(res.data.deck_id)
         }
         fetchDeckId();
    }, [])

    async function getCard(deckId){
        const res=await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        
        if(res.data.remaining ===0 ){
            alert("there is no more cards!")
            clearInterval(timerId.current)
        }
        // console.log(res.data.cards[0].image, deckId)
        setCardImgs(cardImgs=>[...cardImgs, res.data.cards[0].image])
        
    }

    const HandleDraw = () => {
        if(!isDrawing){
            
            setIsDrawing(isDrawing => !isDrawing);
            // start calling getCard function every seconds =>useEffect => clean up function to stop the Interval.
            
            timerId.current = setInterval(async ()=>{
                // console.log(timerId)
                await getCard(deckId);  
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

// springboard
// uses useState to start setInterval when autoDraw turns True by setting the second paramenter for useState to [autoDraw]
/* Deck: uses deck API, allows drawing card at a time. */

// function Deck() {
//     const [deck, setDeck] = useState(null);
//     const [drawn, setDrawn] = useState([]);
//     const [autoDraw, setAutoDraw] = useState(false);
//     const timerRef = useRef(null);
  
//     /* At mount: load deck from API into state. */
//     useEffect(() => {
//       async function getData() {
//         let d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
//         setDeck(d.data);
//       }
//       getData();
//     }, [setDeck]);
  
//     /* Draw one card every second if autoDraw is true */
//     useEffect(() => {
//       /* Draw a card via API, add card to state "drawn" list */
//       async function getCard() {
//         let { deck_id } = deck;
  
//         try {
//           let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw/`);
  
//           if (drawRes.data.remaining === 0) {
//             setAutoDraw(false);
//             throw new Error("no cards remaining!");
//           }
  
//           const card = drawRes.data.cards[0];
  
//           setDrawn(d => [
//             ...d,
//             {
//               id: card.code,
//               name: card.suit + " " + card.value,
//               image: card.image
//             }
//           ]);
//         } catch (err) {
//           alert(err);
//         }
//       }
  
//       if (autoDraw && !timerRef.current) {
//         timerRef.current = setInterval(async () => {
//           await getCard();
//         }, 1000);
//       }
  
//       return () => {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       };
//     }, [autoDraw, setAutoDraw, deck]);
  
//     const toggleAutoDraw = () => {
//       setAutoDraw(auto => !auto);
//     };
  
//     const cards = drawn.map(c => (
//       <Card key={c.id} name={c.name} image={c.image} />
//     ));
  
//     return (
//       <div className="Deck">
//         {deck ? (
//           <button className="Deck-gimme" onClick={toggleAutoDraw}>
//             {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
//           </button>
//         ) : null}
//         <div className="Deck-cardarea">{cards}</div>
//       </div>
//     );
//   }
  
//   export default Deck;
  