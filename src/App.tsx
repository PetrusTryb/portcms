import React from 'react';
import './App.css';
import Component, {ComponentProps} from "./components/component";

type pageData = {
    id: string,
    meta: {
        title: string,
        subtitle: string,
    },
    components: Array<ComponentProps[keyof ComponentProps]>
}
function fetchData() {
    const preferredLanguage = navigator.language.split('-')[0];
    console.log(preferredLanguage)
    const data: pageData = {
        id: "1",
        meta: {
            title: "Hello World",
            subtitle: "This is a subtitle"
        },
        components: [
            {
                id: "1",
                type: "navbar",
                data: {
                    logo: "https://via.placeholder.com/150",
                    smallLogo: "https://via.placeholder.com/50",
                    pages: [
                        {
                            id: "1",
                            name: "Home",
                            url: "/"
                        },
                        {
                            id: "2",
                            name: "About",
                            url: "/about"
                        },
                        {
                            id: "3",
                            name: "Contact",
                            url: "/contact"
                        }
                    ]
                }
            },
            {
                id: "2",
                type: "hero",
                data: {
                    title: "Hello World",
                    subtitle: "This is a subtitle",
                    image: "https://via.placeholder.com/500",
                }
            }
        ]
    }
    //TODO: fetch data from API
    return data
}

function App() {
    let data = fetchData();
  return (
    <div className="App">
        {data.components.map((component) => (
            <Component key={component.id} {...component} />
        ))}
    </div>
  );
}

export default App;
