import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";
import axios from "axios";
import "./CardDeck.css";

const CardDeck = () => {
	const [cardList, setCardList] = useState([]);
	const [drawStatus, setDrawStatus] = useState(false);
	const deckId = useRef();
	const timerId = useRef();
	const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

	// shuffle deck and get deckId
	useEffect(() => {
		async function getDeck() {
			let deck = await axios.get(`${API_BASE_URL}/new/shuffle`);
			deckId.current = deck.data.deck_id;
		}
		getDeck();
	}, []);

	useEffect(() => {
		if (cardList.length > 51) {
			alert("Error: no cards remaining!");
			changeDraw();
			clearInterval(timerId.current);
		}
	}, [cardList]);

	useEffect(() => {
		console.log(drawStatus);
		if (drawStatus && cardList.length < 51) {
			timerId.current = setInterval(async () => {
				await drawCard();
			}, 500);
		} else {
			clearInterval(timerId.current);
		}
	}, [drawStatus]);

	const changeDraw = () => {
		setDrawStatus((status) => !status);
	};

	const drawCard = async () => {
		let card = await axios.get(`${API_BASE_URL}/${deckId.current}/draw`);
		let cardData = card.data.cards[0];
		setCardList((cards) => {
			return [...cards, { code: cardData.code, image: cardData.images.png }];
		});
	};

	let displayCards = (
		<div className="CardDeck-table">
			{cardList.map((card) => (
				<Card key={card.code} id={card.code} image={card.image} />
			))}
		</div>
	);

	let btnText = drawStatus ? "Stop" : "GIMME A CARD!";

	return (
		<div className="CardDeck">
			{cardList.length < 52 ? (
				<button className="CardDeck-btn" onClick={changeDraw}>
					{btnText}
				</button>
			) : (
				""
			)}
			{cardList.length > 0 ? displayCards : ""}
		</div>
	);
};

export default CardDeck;
