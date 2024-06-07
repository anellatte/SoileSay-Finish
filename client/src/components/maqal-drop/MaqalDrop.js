import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import './MaqalDrop.css'; // Rename this to MaqalDrop.css

const ItemType = 'WORD';

const Word = ({ word, index, moveWord }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveWord(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="word-container">
      {word}
    </div>
  );
};

const NewsArticle = ({ article, onLevelComplete }) => {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const words = article.sentence.split(/(\s+|[.,!?;])/).filter(word => word.trim().length > 0);
    setShuffledWords(shuffleArray(words.slice()));
  }, [article.sentence]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const moveWord = useCallback((fromIndex, toIndex) => {
    setShuffledWords((prevWords) =>
      update(prevWords, {
        $splice: [
          [fromIndex, 1],
          [toIndex, 0, prevWords[fromIndex]],
        ],
      })
    );
  }, []);

  const checkOrder = () => {
    const correctOrder = article.sentence.split(/(\s+|[.,!?;])/).filter(word => word.trim().length > 0);
    if (JSON.stringify(shuffledWords) === JSON.stringify(correctOrder)) {
      setMessage('Excellent! The order is correct.');
      onLevelComplete();
    } else {
      setMessage('Oops! The order is incorrect.');
    }
  };

  return (
    <div className="news-article">
      <DndProvider backend={HTML5Backend}>
        {shuffledWords.map((word, index) => (
          <Word key={index} index={index} word={word} moveWord={moveWord} />
        ))}
      </DndProvider>
      <button onClick={checkOrder} className="check-button">Check Order</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

function MaqalDrop() {
  const [news, setNews] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/news');
        setNews(response.data.reverse()); // Reverse the order of news items here
      } catch (error) {
        console.error(error);
      }
    };
    fetchNews();
  }, []);

  const handleLevelComplete = () => {
    setCurrentLevel(prevLevel => prevLevel + 1);
  };

  return (
    <div className="user-page">
      <h1>Welcome, User!</h1>
      <p>You have successfully signed up/logged in.</p>
      <div className="news-section">
        {news.length === 0 ? (
          <p>No news available</p>
        ) : (
          news.map((article, index) => (
            index <= currentLevel && (
              <NewsArticle key={article._id} article={article} onLevelComplete={handleLevelComplete} />
            )
          ))
        )}
      </div>
    </div>
  );
}

export default MaqalDrop;
