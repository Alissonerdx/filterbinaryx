// ==UserScript==
// @name         FilterBinaryx
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scan Binaryx Market
// @author       Alisson Pereira
// @match        https://market.binaryx.pro/
// @icon         https://www.google.com/s2/favicons?domain=binaryx.pro
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //Const
    window.rarityEnum = {
        All: [],
        Legendary: [401, 999],
        Epic: [371, 400],
        Elite: [321, 370],
        Common: [0, 250]
    };

    window.classEnum = {
        All: '',
        Warrior: '0x22F3E436dF132791140571FC985Eb17Ab1846494',
        Thief: '0xaF9A274c9668d68322B0dcD9043D79Cd1eBd41b3',
        Mage: '0xC6dB06fF6e97a6Dc4304f7615CdD392a9cF13F44',
        Ranger: '0xF31913a9C8EFE7cE7F08A1c08757C166b572a937',
        Katrina: '0x819E04ddE93600b224F65e3C9B51b1B4D9fBa3b5',
    }

    window.goldJobEnum = {
       PartTime: 0,
       Winemaker: 1,
       Lumberjack: 2,
       ScrollScribe: 3,
       Hunting: 4,
       LegendaryField: 5
    }

    window.orderEnum = {
      Gold: 0,
      ROI: 1,
      Cost: 2
    }

    //Contracts
    window.contractGold = '0xb3a6381070B1a15169DEA646166EC0699fDAeA79';
    window.contractBnx = '0x8c851d1a123ff703bd1f9dabe631b69902df5f97';
    window.contractBnb =

    window.bnxEndpoint = `https://api.pancakeswap.info/api/v2/tokens/${window.contractBnx}`;
    window.goldEndpoint = `https://api.pancakeswap.info/api/v2/tokens/${window.contractGold}`;
    window.bnbEndpoint = 'https://api.binance.com/api/v3/avgPrice?symbol=BNBUSDT';

    window.blocksPerDay = 57600;

    window.bnxPrice = {};
    window.goldPrice = {};
    window.bnbPrice = {};


    //Filters
    window.agile = -1;
    window.strength = -1;
    window.constitution = -1;
    window.willpower = -1;
    window.intelligence = -1;
    window.spirit = -1;
    window.rarity = window.rarityEnum.All;

    window.page = 1;
    window.pageSize = 99;
    window.status = 'selling';
    window.name = '';
    window.sort = 'time';
    window.direction = 'desc';
    window.career = '';

    window.allOffers = [];
    window.analysis = [];

    window.levelCost = [{ minLevel: 1, maxLevel: 2, goldCoin: 20000, bnx: 0, failure: 0, multiplier: 2},
                       { minLevel: 2, maxLevel: 3, goldCoin: 50000, bnx: 0, failure: 0, multiplier: 4},
                       { minLevel: 3, maxLevel: 4, goldCoin: 150000, bnx: 0, failure: 0, multiplier: 8},
                       { minLevel: 4, maxLevel: 5, goldCoin: 450000, bnx: 5, failure: 0, multiplier: 16},
                       { minLevel: 5, maxLevel: 6, goldCoin: 1000000, bnx: 50, failure: 25, multiplier: 25},
                       { minLevel: 6, maxLevel: 7, goldCoin: 2000000, bnx: 100, failure: 25, multiplier: 50},
                       { minLevel: 7, maxLevel: 8, goldCoin: 5000000, bnx: 500, failure: 25, multiplier: 75},
                       { minLevel: 8, maxLevel: 9, goldCoin: 10000000, bnx: 1000, failure: 30, multiplier: 100},
                       { minLevel: 9, maxLevel: 10, goldCoin: 20000000, bnx: 1000, failure: 30, multiplier: 200},
                       { minLevel: 10, maxLevel: 11, goldCoin: 50000000, bnx: 2000, failure: 50, multiplier: 300},
                       { minLevel: 11, maxLevel: 12, goldCoin: 100000000, bnx: 5000, failure: 50, multiplier: 500}]

    function GetLevelUpCost(currentLevel, targetLevel)
    {
        let levelCosts = window.levelCost.filter(function(value) {
            return value.minLevel < targetLevel;
        });

        return levelCosts.reduce(function (a, b) {
            return a + parseInt(b.goldCoin);
        }, 0);
    }

    async function GetPrices()
    {
        window.bnxPrice = await window.getBnx().then(resp => resp);
        window.goldPrice = await window.getGold().then(resp => resp);
        window.bnbPrice = await window.getBnb().then(resp => resp)
    }

    window.getBnx = async function(){
        return await fetch(window.bnxEndpoint).then((response) => {
            return response.json();
        })
        .then(data => data)
        .catch(function(error) {
           console.log(error);
        });
    }

    window.getGold = async function(){
        return await fetch(window.goldEndpoint).then((response) => {
            return response.json();
        })
        .then(data => data)
        .catch(function(error) {
           console.log(error);
        });
    }

    window.getBnb = async function(){
        return await fetch(window.bnbEndpoint).then((response) => {
            return response.json();
        })
        .then(data => data)
        .catch(function(error) {
           console.log(error);
        });
    }

    function SalaryByBlockBasic(mainStat) {
       return 0.01 + (mainStat - 85) * 0.005;
    }

    window.goldByDay = function(level, strength, agility, physique, volition, brains, charm, job)
    {
        let salaryByBlock = 0.01;
        if(job == window.goldJobEnum.Hunting) {
            salaryByBlock = SalaryByBlockBasic(strength);
        }

        if(job == window.goldJobEnum.Lumberjack) {
            salaryByBlock = SalaryByBlockBasic(strength);
        }

        if(job == window.goldJobEnum.ScrollScribe) {
            salaryByBlock = SalaryByBlockBasic(brains);
        }

        if(job == window.goldJobEnum.Winemaker) {
            salaryByBlock = SalaryByBlockBasic(agility);
        }

        if(job == window.goldJobEnum.LegendaryField) {
            salaryByBlock = 0.065 + (strength+agility+physique+volition+brains+charm-window.rarityEnum.Legendary[0]) * 0.0025;
        }

        let salaryPerDay = salaryByBlock * window.blocksPerDay;
        return salaryPerDay * Math.pow(2, level - 2);
    }

    window.scan = function Scan(agile, strength, constitution, willpower, intelligence, spirit, rarity = window.rarityEnum.All, classe = window.classEnum.All)
    {
        window.agile = agile;
        window.strength = strength;
        window.constitution = constitution;
        window.willpower = willpower;
        window.intelligence = intelligence;
        window.spirit = spirit;
        window.rarity = rarity;

        window.career = classe;
    }

    function GetJobName(job) {

        if(job === window.goldJobEnum.PartTime) {
            return "Part Time";
        }
        else if(job === window.goldJobEnum.Winemaker) {
            return "Winemaker";
        }
        else if(job === window.goldJobEnum.Lumberjack) {
            return "LumberJack";
        }
        else if(job === window.goldJobEnum.ScrollScribe) {
            return "ScrollScribe";
        }
        else if(job === window.goldJobEnum.Hunting) {
            return "Hunting";
        }
        else if(job === window.goldJobEnum.LegendaryField) {
            return "Legendary Field";
        }

    }





    window.filter = async function Filter(numberTopOffers, maxBnb, maxUsd, carrer, job, maxRoi, minGoldDay, order)
    {
        if(window.analysis.length == 0) {
            console.log('Initializing scanning according to added filters.');
            await window.process();
        }

        let filtered = window.analysis;
        if(numberTopOffers === null || numberTopOffers === undefined) {
            numberTopOffers = window.analysis.length;
        }

        if(order == window.orderEnum.Gold) {
            filtered.sort(function(a, b) {
//                 if(b.goldByDay === b.goldByDay) {

//                     if(b.roi === b.roi) {
//                         return a.totalInvestment - b.totalInvestment;
//                     }

//                     return a.roi - b.roi;
//                 }
                return b.goldByDay - a.goldByDay;
            });
        }

        if(order == window.orderEnum.ROI) {
            filtered.sort(function(a, b) {
                // if(a.roi === b.roi) {
                //     if(b.goldByDay === a.goldByDay) {
                //         return a.totalInvestment - b.totalInvestment;
                //     }
                //     return b.goldByDay - a.goldByDay;
                // }
                return a.roi - b.roi;
            });
        }

        if(order == window.orderEnum.Cost) {
            filtered.sort(function(a, b) {
                // if(a.totalInvestment === b.totalInvestment) {
                //     if(b.goldByDay === b.goldByDay) {
                //         return a.roi - b.roi;
                //     }
                //     return b.goldByDay - a.goldByDay;
                // }
                return a.totalInvestment - b.totalInvestment;
            });
        }

        if(maxBnb) {
            filtered = filtered.filter(e => e.totalInvestmentInBnb <= maxBnb);
        }

        if(maxUsd){
            filtered = filtered.filter(e => e.totalInvestment <= maxUsd);
        }

        if(carrer){
            filtered = filtered.filter(e => e.offer.career_address.toUpperCase() == carrer.toUpperCase());
        }

        if(job) {
            filtered = filtered.filter(e => e.job == job);
        }

        if(maxRoi) {
            filtered = filtered.filter(e => e.roi <= maxRoi);
        }

        if(minGoldDay) {
            filtered = filtered.filter(e => e.goldByDay >= minGoldDay);
        }

        console.log("%cFILTERED OFFERS", "color: blue");
        filtered = filtered
            .filter((e) => e.job !== undefined)
            .slice(0, numberTopOffers);

       filtered.forEach((e, i) => {
           console.log(`TOTAL COST: USD ${e.totalInvestment.toFixed(2)} | ${e.totalInvestmentInBnb.toFixed(2)} BNB |`,
                      `ROI: ${e.roi.toFixed(2)} |`,
                      `GOLD/DAY: ${e.goldByDay.toFixed(0)} |`,
                      `LEVEL: ${e.offer.level} => ${e.offer.level + e.levelUpBy} (${e.levelUpCost}) |`,
                      `JOB: ${GetJobName(e.job)} |`,
                      `LINK: https://market.binaryx.pro/#/oneoffsale/detail/${e.offer.order_id} |`);

        });
    }

    function GetJobsFor(offer){
         if(offer.career_address == window.classEnum.Mage && offer.brains > 86 && offer.charm > 61) {
             return window.goldJobEnum.ScrollScribe;
         }

         if(offer.career_address == window.classEnum.Ranger && offer.strength > 86 && offer.agility > 61) {
             return window.goldJobEnum.Hunting;
         }

        if(offer.career_address == window.classEnum.Thief && offer.agility > 86 && offer.strength > 61) {
             return window.goldJobEnum.Winemaker;
        }

        if(offer.career_address == window.classEnum.Warrior && offer.strength > 86 && offer.physique > 61) {
             return window.goldJobEnum.Lumberjack;
        }

        if(offer.total > 400) {
             return window.goldJobEnum.LegendaryField;
        }

    }

    const uniqueIds = [];

    window.process = async function Process() {
        await GetPrices();
        await window.getAllOffers();
        window.analysis = [];

        const unique = window.allOffers.filter(element => {
            const isDuplicate = uniqueIds.includes(element.order_id);

            if (!isDuplicate) {
                uniqueIds.push(element.order_id);

                return true;
            }
        });

        unique.forEach((e, i) => {
           let levelCount = Math.max(0, 5 - e.level);
           let job = GetJobsFor(e);
           let count = 0;
           while(count <= levelCount)
           {
               window.analysis.push(Analyze(e, e.level + count, job));
               count++;
           }
        });
    }

    function Analyze(offer, level, job)
    {
        let offerPrice = parseFloat(offer.price);
        let goldByDay = window.goldByDay(level, offer.strength, offer.agility, offer.physique, offer.volition, offer.brains, offer.charm, job);
        let goldCost = offer.pay_addr.toUpperCase() == window.contractGold.toUpperCase() ? offerPrice : 0;
        let bnxCost = offer.pay_addr.toUpperCase() == window.contractBnx.toUpperCase() ? offerPrice / Math.pow(10, 18) : 0;
        let levelUpBy = level - offer.level;
        let levelUpCost = GetLevelUpCost(offer.level, level);
        let totalInvestment = (levelUpCost * parseFloat(window.goldPrice.data.price)) + (goldCost * parseFloat(window.goldPrice.data.price)) + (bnxCost * parseFloat(window.bnxPrice.data.price));
        let totalInvestmentInBnb = totalInvestment / parseFloat(window.bnbPrice.price);
        let roi = (totalInvestment / (goldByDay * parseFloat(window.goldPrice.data.price)) * 24) / 24;

        return {
           offer,
           bnxCost,
           goldCost,
           goldByDay,
           levelUpBy,
           levelTarget: level,
           levelUpCost,
           job,
           roi,
           totalInvestment,
           totalInvestmentInBnb
        };
    }

    window.getAllOffers = async function GetAllOffers() {

     window.allOffers = [];
     let query = 'https://market.binaryx.pro/getSales?';

     if(window.page != -1) {
         query += `page=${window.page}&`;
     }

     if(window.pageSize != -1) {
         query += `page_size=${window.pageSize}&`;
     }

     if(window.status != '') {
         query += `status=${window.status}&`;
     }

     if(window.name != '') {
         query += `name=${window.name}&`;
     }

     if(window.sort != '') {
         query += `sort=${window.sort}&`;
     }

     if(window.direction != '') {
        query += `direction=${window.direction}&`;
     }

     if(window.career != '') {
         query += `career=${window.career}&`;
     }

     let startValues = [];
     let endValues = [];
     let attrValues = [];

     if(window.rarity.length == 0) {
         query += `value_attr=`;
     }
     else {
         attrValues.push(`total`);
         startValues.push(window.rarity[0]);
         endValues.push(window.rarity[1]);
     }


     if(window.strength != -1) {
         attrValues.push(`strength`);
         startValues.push(window.strength);
         endValues.push(0);
     }

     if(window.agile != -1) {
         attrValues.push(`agility`);
         startValues.push(window.agile);
         endValues.push(0);
     }

     if(window.constitution != -1) {
         attrValues.push(`physique`);
         startValues.push(window.constitution);
         endValues.push(0);
     }

     if(window.willpower != -1) {
         attrValues.push(`volition`);
         startValues.push(window.willpower);
         endValues.push(0);
     }

     if(window.intelligence != -1) {
         attrValues.push(`brains`);
         startValues.push(window.intelligence);
         endValues.push(0);
     }

     if(window.spirit != -1) {
         attrValues.push(`charm`);
         startValues.push(window.spirit);
         endValues.push(0);
     }

     query += `${attrValues.join(',')}&`;
     query += `start_value=${startValues.join(',')}&end_value=${endValues.join(',')}`;

     let page = window.page;
     let size = window.pageSize;
     let count = -1;

     while(count == -1 || page * size < count)
     {
         try
         {
             let data = await fetch(query, {
             "headers": {
                 "accept": "application/json, text/plain, */*",
                 "accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                 "cache-control": "no-cache",
                 "pragma": "no-cache",
                 "sec-ch-ua": "\"Microsoft Edge\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
                 "sec-ch-ua-mobile": "?0",
                 "sec-ch-ua-platform": "\"Windows\"",
                 "sec-fetch-dest": "empty",
                 "sec-fetch-mode": "cors",
                 "sec-fetch-site": "same-origin"
             },
             "referrer": "https://market.binaryx.pro/",
             "referrerPolicy": "strict-origin-when-cross-origin",
             "body": null,
             "method": "GET",
             "mode": "cors",
             "credentials": "include"
             })
             .then(resp => resp.json())
             .then(resp => resp.data);

             if(count == -1)
             {
                 count = data.result.total;
             }

             window.allOffers = window.allOffers.concat(data.result.items);
             page++;

             console.log(`Loading ${page * size} of ${count} offers`);
         } catch {
             console.log("Error");
         }

     }
//1000000000000000000
    }

    // Your code here...
})();