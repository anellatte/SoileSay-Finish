import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Alert, Form } from 'react-bootstrap';
import { getUserProfile, getSozdlyByLevel, updateSozdlyLevel, getCompletedSozdly } from '../api';

const Sozdly = () => {
    const [guesses, setGuesses] = useState(Array(6).fill(''));
    const [currentGuess, setCurrentGuess] = useState('');
    const [attempt, setAttempt] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [sozdlyLevel, setSozdlyLevel] = useState(1);
    const [completedLevels, setCompletedLevels] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentWord, setCurrentWord] = useState('');
    const [noMoreLevels, setNoMoreLevels] = useState(false);
    const [isLevelCompleted, setIsLevelCompleted] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getUserProfile();
                setSozdlyLevel(userData.sozdlyLevel);
                setCurrentLevel(userData.sozdlyLevel);

                const sozdlyData = await getSozdlyByLevel(userData.sozdlyLevel);
                if (sozdlyData && sozdlyData.word) {
                    setCurrentWord(sozdlyData.word.toUpperCase());
                } else {
                    setFeedbackMessage('Failed to load sozdly level');
                }

                const completedData = await getCompletedSozdly();
                setCompletedLevels(completedData);
            } catch (error) {
                setFeedbackMessage('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [attempt]);

    const handleGuessChange = (event) => {
        const value = event.target.value.toUpperCase();
        if (value.length <= 5) {
            setCurrentGuess(value);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    };

    const checkAnswer = async () => {
        if (currentGuess.length !== 5) {
            setFeedbackMessage('The word must be exactly 5 letters long.');
            return;
        }

        const newGuesses = [...guesses];
        newGuesses[attempt] = currentGuess;
        setGuesses(newGuesses);

        if (currentGuess === currentWord) {
            setFeedbackMessage('Correct!');
            setIsLevelCompleted(true); // Set level as completed
            try {
                const response = await updateSozdlyLevel(currentLevel);
                if (response.message === 'No more levels') {
                    setNoMoreLevels(true);
                    setFeedbackMessage('');
                } else if (response.sozdlyLevel !== sozdlyLevel) {
                    setSozdlyLevel(response.sozdlyLevel);
                    setCurrentLevel(response.sozdlyLevel);
                    // Fetch new data for the new level
                    const sozdlyData = await getSozdlyByLevel(response.sozdlyLevel);
                    if (sozdlyData && sozdlyData.word) {
                        setCurrentWord(sozdlyData.word.toUpperCase());
                        setGuesses(Array(6).fill(''));
                        setCurrentGuess('');
                        setAttempt(0);
                        setNoMoreLevels(false); // New level found, reset no more levels message
                    } else {
                        setNoMoreLevels(true); // No new level found, set no more levels message
                    }
                    // Update completed levels
                    const completedData = await getCompletedSozdly();
                    setCompletedLevels(completedData);
                } else {
                    setFeedbackMessage('Correct, try the next level.');
                }
            } catch (error) {
                setFeedbackMessage('Error updating sozdly level');
            }
        } else if (attempt < 5) {
            setAttempt(attempt + 1);
            setCurrentGuess('');
            setFeedbackMessage('Try again.');
        } else {
            setFeedbackMessage(`Game over! The correct word was: ${currentWord}`);
        }
    };

    const handleLevelClick = async (level) => {
        try {
            const sozdlyData = await getSozdlyByLevel(level);
            if (sozdlyData) {
                setCurrentWord(sozdlyData.word.toUpperCase());
                setGuesses(Array(6).fill(''));
                setCurrentGuess('');
                setAttempt(0);
                setFeedbackMessage('');
                setCurrentLevel(level);
                setNoMoreLevels(false); // Reset no more levels message when switching levels
                setIsLevelCompleted(false); // Reset level completion state
            } else {
                setFeedbackMessage('Failed to load sozdly level');
            }
        } catch (error) {
            setFeedbackMessage('Failed to load sozdly level');
        }
    };

    const handleCellClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const getBackgroundColor = (guess, index) => {
        if (isLevelCompleted && attempt === index) {
            return 'green';
        }

        const guessLetter = guess[index];
        const correctLetter = currentWord[index];

        const correctLetterCount = currentWord.split('').filter(letter => letter === guessLetter).length;
        const guessLetterCount = guess.split('').filter(letter => letter === guessLetter).length;

        const correctPositions = currentWord.split('').reduce((acc, letter, idx) => {
            if (letter === guessLetter) {
                acc.push(idx);
            }
            return acc;
        }, []);

        const guessPositions = guess.split('').reduce((acc, letter, idx) => {
            if (letter === guessLetter) {
                acc.push(idx);
            }
            return acc;
        }, []);

        if (guessPositions.includes(index) && correctPositions.includes(index)) {
            return 'green';
        }

        if (correctPositions.some(pos => guessPositions.includes(pos)) && guessLetterCount <= correctLetterCount) {
            return 'yellow';
        }

        return 'gray';
    };

    return (
        <Container className='sozdly content__body'>
            <div className='container'>
                <div className='sozdly__inner'>
                    <h1 className="sozdly__title title">SOZDLY</h1>

                    <div className='suraq-desc'>
                        <p className='suraq-desc__title'>Level {currentLevel}</p>
                        {guesses.map((guess, attemptIndex) => (
                            <div key={attemptIndex} className="guess-input d-flex justify-content-between mb-2">
                                {attemptIndex === attempt && !isLevelCompleted ? (
                                    <Form.Control
                                        ref={inputRef}
                                        type="text"
                                        value={currentGuess}
                                        onChange={handleGuessChange}
                                        onKeyPress={handleKeyPress}
                                        maxLength="5"
                                        style={{ width: '300px', textAlign: 'center', fontSize: '2em' }}
                                    />
                                ) : (
                                    [...Array(5)].map((_, index) => (
                                        <Form.Control
                                            key={index}
                                            type="text"
                                            value={guess[index] || ''}
                                            readOnly
                                            style={{
                                                width: '60px',
                                                textAlign: 'center',
                                                fontSize: '2em',
                                                backgroundColor: guess ? getBackgroundColor(guess, attemptIndex) : 'white'
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                        ))}
                        <Button variant="success" className="mt-4" onClick={checkAnswer}>Check</Button>
                        {feedbackMessage && (
                            <Alert variant={feedbackMessage.startsWith('Correct') ? 'success' : 'danger'} className="mt-4">
                                {feedbackMessage}
                            </Alert>
                        )}
                        {noMoreLevels && (
                            <Alert variant="info" className="mt-4">
                                Wow, you've reached the end of our current levels. Congratulations on your achievement. We're grateful for your dedication. We're working on adding new levels, and we'll let you know as soon as they're ready.
                            </Alert>
                        )}
                    </div>
                </div>

                <div className='levels'>
                    <div className='levels__inner'>
                        <h2 className="levels__title">LEVELS</h2>
                        {[...Array(sozdlyLevel).keys()].map(i => {
                            const level = i + 1;
                            const isDisabled = level > sozdlyLevel;

                            return (
                                <Button
                                    key={level}
                                    className="level__number"
                                    onClick={() => handleLevelClick(level)}
                                    disabled={isDisabled}
                                    style={isDisabled ? { backgroundColor: 'grey', cursor: 'not-allowed' } : {}}
                                >
                                    Level {level}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Sozdly;
