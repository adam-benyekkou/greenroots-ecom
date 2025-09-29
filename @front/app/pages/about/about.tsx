import { Link } from "react-router";
import "./about.css";
import farmMan from "./images/farm-man.webp"
import team from './images/team.webp'
import mail from './images/mail.svg'

export default function About() {

    return (
        <div className="about-container">
            <div className="container-sections-1-2">

                <section className="about-section1" aria-label="Nos actions de reforestation">
                    <img
                        src={farmMan}
                        alt="Agriculteur travaillant dans un champ, symbolisant notre engagement avec les communautés locales"
                        className="about-image1"
                        loading="lazy"
                    />
                    <div className="main-div">
                        <h2 className="about-title">Nos actions</h2>
                        <p>Chez GreenRoots, nous nous engageons activement dans la lutte contre la déforestation en développant des projets de reforestation durables à travers le monde. En collaboration avec les communautés locales, nous plantons des essences d'arbres adaptées aux écosystèmes, favorisons la restauration des sols dégradés et soutenons la biodiversité. Chaque projet vise à créer un impact environnemental mesurable tout en apportant des bénéfices économiques et sociaux aux populations. Parce que replanter, c'est aussi réparer, nous croyons en un avenir plus vert, un arbre à la fois.</p>
                    </div>
                </section>

                <section className="about-section2" aria-label="Présentation de nos équipes">
                    <img
                        src={team}
                        alt="Mains touchant délicatement le sol herbeux, représentant le lien entre nos équipes et la nature"
                        className="about-image2"
                        loading="lazy"
                    />
                    <div className="main-div">
                        <h2 className="about-title">Nos équipes</h2>
                        <p>Derrière chaque projet, il y a une équipe passionnée et engagée. Nos experts en environnement, ingénieurs forestiers, coordinateurs de terrain et partenaires locaux travaillent main dans la main pour garantir l'impact durable de nos actions. Présents sur plusieurs continents, ils allient savoir-faire scientifique et connaissance du terrain pour adapter chaque reforestation aux besoins écologiques et humains de la région. En participant activement à la vie locale — de la sensibilisation à l'éducation environnementale — nos équipes s'intègrent pleinement aux communautés pour construire ensemble des solutions durables.</p>
                    </div>
                </section>
            </div>

            <section className="about-section3" aria-label="Informations de contact">
                <div className="contact">
                    <div className="contact-main-container">
                        <h2 className="about-title">Nous contacter</h2>
                        <p>Vous avez une question sur nos projets, nos équipes ou nos arbres? N'hésitez pas à nous contacter, nous serons ravis d'échanger avec vous!</p>
                        <Link to="mailto:hello@greenroots.org" className="email" aria-label="Envoyer un email à GreenRoots">
                            hello@greenroots.org
                        </Link>
                    </div>
                    <img
                        src={mail}
                        alt="Icône d'enveloppe représentant le contact par email"
                        className="envelope"
                        aria-hidden="true"
                    />
                </div>
            </section>
        </div>
    )
}