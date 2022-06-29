import './Spinner.css';
export default function Spinner() {
    return (
        <div className="flex h-screen lds-ring">
        <div></div><div></div><div></div><div></div>
        </div>
    );
}