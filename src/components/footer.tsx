import Image from "next/image";
import Link from "next/link";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer bg-base-200 text-base-content p-10">
            <aside>
                <Image src={"/logo.png"} alt={"Chrischona Logo"} width={100} height={100}/>
                <p>
                    Chrischona Planer
                    <br/>
                    Teil des Verband Viva Kirsche Schweiz<br/>
                    &copy; {year}
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Services</h6>
                <Link href={""} className="link link-hover">Gottesdienst Planer</Link>
                <Link href={""} className="link link-hover">Team Management</Link>
                <Link href={""} className="link link-hover">Standort Management</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Projekt</h6>
                <Link target={"_blank"} href={""} className="link link-hover">Über uns</Link>
                <Link target={"_blank"} href={""} className="link link-hover">Kontakt</Link>
                <Link target={"_blank"} href={""} className="link link-hover">Feedback</Link>
                <Link target={"_blank"} href={"https://github.com/M4rshe1/chrischona-planer"} className="link link-hover">Github</Link>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <Link target={"_blank"} href={""} className="link link-hover">Terms of use</Link>
                <Link target={"_blank"} href={""} className="link link-hover">Privacy policy</Link>
                <Link target={"_blank"} href={""} className="link link-hover">Cookie policy</Link>
            </nav>
        </footer>
    );
}

export default Footer;