import { Link } from "react-router";
import "./about.css";
import farmMan from "./images/farm-man.webp"
import team from './images/team.webp'
import mail from './images/mail.svg'

export default function About() {

    return (
        <div className="about-container">
            <div className="container-sections-1-2">

                <section className="about-section1" aria-label="Our reforestation actions">
                    <img
                        src={farmMan}
                        alt="Farmer working in a field, symbolizing our commitment to local communities"
                        className="about-image1"
                        loading="lazy"
                    />
                    <div className="main-div">
                        <h2 className="about-title">Our Actions</h2>
                        <p>At GreenRoots, we are actively committed to fighting deforestation by developing sustainable reforestation projects around the world. In collaboration with local communities, we plant tree species adapted to ecosystems, promote the restoration of degraded soils, and support biodiversity. Each project aims to create a measurable environmental impact while providing economic and social benefits to populations. Because replanting is also repairing, we believe in a greener future, one tree at a time.</p>
                    </div>
                </section>

                <section className="about-section2" aria-label="Presentation of our teams">
                    <img
                        src={team}
                        alt="Hands gently touching the grassy ground, representing the link between our teams and nature"
                        className="about-image2"
                        loading="lazy"
                    />
                    <div className="main-div">
                        <h2 className="about-title">Our Teams</h2>
                        <p>Behind every project is a passionate and committed team. Our environmental experts, forest engineers, field coordinators, and local partners work hand in hand to ensure the lasting impact of our actions. Present on several continents, they combine scientific know-how and field knowledge to adapt each reforestation to the ecological and human needs of the region. By actively participating in local life — from awareness raising to environmental education — our teams fully integrate into communities to build sustainable solutions together.</p>
                    </div>
                </section>
            </div>

            <section className="about-section3" aria-label="Contact information">
                <div className="contact">
                    <div className="contact-main-container">
                        <h2 className="about-title">Contact Us</h2>
                        <p>Do you have a question about our projects, our teams, or our trees? Do not hesitate to contact us, we will be delighted to exchange with you!</p>
                        <Link to="mailto:hello@greenroots.org" className="email" aria-label="Send an email to GreenRoots">
                            hello@greenroots.org
                        </Link>
                    </div>
                    <img
                        src={mail}
                        alt="Envelope icon representing email contact"
                        className="envelope"
                        aria-hidden="true"
                    />
                </div>
            </section>
        </div>
    )
}