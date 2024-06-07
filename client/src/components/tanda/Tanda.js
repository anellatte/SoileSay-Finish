import React from 'react';

const Tanda = () => {
    return (
        <div className='tanda content__body'>
            <div className='container'>
                <div className='tanda__inner'>
                    <h1 className='tanda__title title'>TANDA</h1>

                    <iframe
                        title="Tanda Game"
                        src="https://turashbayevajr.github.io/tanda/"
                        width="100%"  // Responsive width
                        height="600"  // Fixed height, adjust as needed
                        style={{ border: 'none' }}  // Optional, removes border
                        scrolling="yes">
                    </iframe>

                </div>
            </div>
        </div>
    );
};

export default Tanda;