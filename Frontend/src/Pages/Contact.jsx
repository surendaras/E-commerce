import './InfoPages.css'

const Contact = () => {
    return (
        <main className='info-page'>
            <div>
                <h1>Contact</h1>
                <div className='contact-details'>
                    <div className='contact-row'><strong>Email:</strong> <a href='mailto:surendak61004@gmail.com'>surendak61004@gmail.com</a></div>
                    <div className='contact-row'><strong>Phone:</strong> <a href='tel:+91 7451981686'>+91 7451981686</a></div>
                    <div className='contact-row'><strong>Address:</strong> Manohar Pur Mahavan Mathura</div>
                    <div className='contact-row'><strong>Business hours:</strong> 24/7</div>
                    <div className='contact-row' style={{ marginTop: 12 }}>You can also use the contact form on our website for order-specific requests — we'll respond within 24 hours.</div>
                </div>
            </div>
        </main>
    )
}

export default Contact
