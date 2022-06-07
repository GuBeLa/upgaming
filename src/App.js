import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [sports, setSports] = useState([]);
    const [teams, setTeams] = useState([]);

    const filterKays = {
        sports: [2, 3],
        regions: [1, 14, 96],
        champs: [654],
        games: [15560820]
    };

    const getSports = () => {
        return axios.get(
            "https://sportservice.inplaynet.tech/api/sport/getheader/en"
        );
    }

    const getTeams = () => {
        return axios.get(
            "https://sportservice.inplaynet.tech/api/sport/getheader/teams/en"
        );
    }

    const setGameName = (game) => {
        return new Promise((resolve, reject) => {
            const gameDetails = sports.find(sport => sport.t1 === game.author);
            if (gameDetails) {
                game.name = gameDetails;
                resolve(game);
            } else {
                reject(Error('თამაში არ მოიძებნა'));
            }
        });
    }

    const getSportById = (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const sport = sports.filter((item) => Number(item?.ID).includes(id));
                if (sport) {
                    resolve(sport);
                } else {
                    reject(new Error("sport not found"));
                }
            }, 200);
        });
    }

    const filterSports = (datas, filters) => {
        let sports = Object.values(datas)?.filter(item => filters['sports'].includes(item.ID));
        sports.forEach(item => {
            item.Regions = Object.values(item.Regions)?.filter(region => filters['regions'].includes(region.ID));
            item.Regions?.forEach(region => {
                region.Champs = Object.values(region.Champs)?.filter(champ => filters['champs'].includes(champ.ID));
                // region.Champs?.forEach(champ => {
                //     champ.GameSmallItems = Object.values(champ.GameSmallItems)?.filter(game => filters['games'].includes(game.ID));
                // })
            })
        })

        return sports;
    };

    useEffect(() => {
        const fetchData = async () => {
            Promise.all([getSports(), getTeams()])
                .then((result) => {
                    let sportsData = JSON.parse(result[0]?.data);
                    let teamsData = JSON.parse(result[1]?.data);
                    setSports(Object.values(sportsData?.EN?.Sports));
                    setTeams(teamsData);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        fetchData();
    }, []);

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
        let filterData = filterSports(sports, filterKays);
        console.log(filterData, "filterData");
    }, [filterKays, sports]);

    return <div>filter data</div>;
};

export default App;
