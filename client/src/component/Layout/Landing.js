import React from 'react';

export default function Landing() {
    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">Developer connector</h1>
                    <p className="lead">
                        Create developer profile/portfolio
                    </p>
                    <div className="buttons">
                        <a href="register.html" className="btn btn-primary">
                            SignUp
                        </a>
                        <a href="login.html" className="btn btn-light">
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
