import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [sportId, setsportId] = useState(1);
    const [regionId, setRegionId] = useState(3);
    const [champsId, setChampsId] = useState(258);
    const [gameId, setGameId] = useState(15655486);

    const [sports, setSports] = useState([]);
    const [teams, setTeams] = useState([]);
    const [region, setRegion] = useState([]);
    const [champs, setChamps] = useState([]);
    const [games, setGames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const collectedTrueKeys = {
        sports: [2, 3],
        regions: [14, 304],
        champs: [258],
        games: [15560820]
    };

    const [list, setList] = useState({
        sports: [],
        regions: [],
        champs: [],
        games: []
    });

    function getSports() {
        return axios.get('https://sportservice.inplaynet.tech/api/sport/getheader/en')
    }

    function getTeams() {
        return axios.get('https://sportservice.inplaynet.tech/api/sport/getheader/teams/en')
    }

    function getSportById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const sport = sports.filter((item) => Number(item?.ID).includes(id));
                if (sport) {
                    resolve(sport)
                } else {
                    reject(new Error('sport not found'))
                }
            }, 200)
        });
    }

    const filterSports = (datas, filters) => {


        // let result = Object.values(datas).filter(obj => Object.values(filters.sports).includes(obj?.sports?.id));
        // let regions = Object.values(datas).filter(obj => obj?.regions?.filter(item => {
        //     Object.values(filters.regions).includes(item?.id)
        // }));
        // // let regions = Object.values(datas).filter(obj => obj?.regions?.some(e => Object.values(filters.regions).every(e?.id)));
        // console.log(regions, 'regions')

        // return Object.values(datas).filter((data) => {
        //     return Object.keys(filters).some((key) => {
        //         console.log(data?.regions?.id)
        //         if (key === 'sports') {
        //             return filters.sports.some((country) => country === data?.sports?.id);
        //         }
        //         if (key === 'regions') {
        //             return filters.regions.some((region) => region === data?.regions?.id);
        //         }
        //         // if (key === 'price') {
        //         //     return hotel.price >= keep_these_hotels.price.min && hotel.price <= keep_these_hotels.price.max;
        //         // }
        //     });
        // })
        const filterKeys = Object.keys(filters);
        // console.log(filterKeys, 'filterKeys')
        return Object.values(datas).filter(data => {
            // console.log(data, 'data')
            return filterKeys.some(key => {
                // console.log(data[key], 'key')
                if (Array.isArray(data[key])) {
                    return data[key].some(item => filters[key].includes(item));
                }
                // console.log(filters[key], data[key]?.id)
                if (filters[key].includes(data[key]?.id)) console.log(data);
                // return filters[key].includes(data?.ID);
            })
        })

        // let filterKeys = Object.entries(filters);
        // return Object.values(datas).filter(eachObj => {
        //     return filterKeys.some((eachKey, eachValues) => {
        //         // console.log(filterKeys[eachValues])
        //         // eachObj[eachValues].filter(item => {
        //         //     console.log(item)
        //         // })
        //         // if (!filters[eachKey].length) {
        //         //     return true; 
        //         // }
        //         return eachObj[eachKey]?.includes(filters[eachKey]);
        //     });
        // });

        
        // return filteredResults
    }

    useEffect(() => {
        const fetchData = async () => {
            Promise.all([getSports(), getTeams()])
                .then(result => {
                    let sportsData = JSON.parse(result[0]?.data);
                    let teamsData = JSON.parse(result[1]?.data);
                    setSports(Object.values(sportsData?.EN?.Sports))
                    setTeams(teamsData)
                })
                .catch(err => {
                    console.log(err)
                });
        }

        fetchData();
    }, []);

    useEffect(() => {
        let result = sports.map(item => ({
            sports: {
                id: item?.ID,
                name: item?.Name,
            },
            regions: Object.values(item?.Regions)?.map(reg => ({
                id: reg?.ID,
                name: reg?.Name,
            })),
            champs: Object.values(item?.Regions)?.map(champs => Object.values(champs?.Champs)?.map(champ => ({
                id: champ?.ID,
                name: champ?.Name,
            }))),
            games: Object.values(item?.Regions)?.map(champs => Object.values(champs?.Champs)?.map(games => Object.values(games?.GameSmallItems)?.map(game => ({
                id: game?.ID,
                t1: game?.t1,
                t2: game?.t2,
            })))),
        }));

        setList(result)
    }, [sports]);

    // useEffect(() => {
    //     getSportById(sportId)
    //         .then(sport => {
    //             setData(sport)
    //             console.log(sport, 'sport data')
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })
    // }, [sportId, sports]);

    useEffect(() => {
        let result = filterSports(list, collectedTrueKeys);
        console.log(filterSports(list, collectedTrueKeys), 'result')
    }, [collectedTrueKeys, list])

    return (
        <div>
            filter data
        </div>
    );
};

export default App;