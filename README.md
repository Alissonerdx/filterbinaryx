# filterbinaryx



Script que facilita a busca pela oferta ideal dentro do mercado do binaryx

Para fazer o escaneamento é necessário executar no console do brownser o comando filter assim que o tamper monkey injetar o script na pagina do mercado do jogo (https://market.binaryx.pro)

- TamperMonkey Chrome - https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
- TamperMonkey Edge - https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd

filter possui alguns parametros para facilitar as buscas e ordenação das ofertas

Obs: as vezes pode demorar um pouco o processamento das ofertas devido a lag no mercado, evitem momentos de pico, como ele processa todo o mercado é bem comum.
Qualquer dúvida só me procurar no discord :D, fiquem a vontade para mudar o script caso queiram fazer melhorias ou ajustes.

segue alguns exemplos:

Exemplo 1: filtrar as 30 top ofertas com o menor ROI (Returno do investimento)
filter(30, null, null, null, null, null, null, window.orderEnum.ROI)

Exemplo 2: filtrar as 50 top ofertas com o maior ganho de gold até 3000 dolares
filter(50, null, 3000, null, null, null, null, window.orderEnum.Gold)

Exemplo 3: filtrar as 20 top ofertas com o menor ROI dos bonecos Warrior
filter(20, null, null, window.classEnum.Warrior, null, null, null, window.orderEnum.ROI)

Exemplo 4: filtrar as 40 top ofertas com até 35 dias de ROI dos bonecos Katrina ordenado por menor custo
filter(40, null, null, window.classEnum.Katrina, null, 35, null, window.orderEnum.Cost)

Exemplo 5: filtrar as 10 top ofertas até 4 BNB que farmam no ScrollScribe que geram no minimo 10000 gold por dias e ordenado por Gold
filter(10, 4, null, null, window.goldJobEnum.ScrollScribe, null, 1000, window.orderEnum.Gold)

Enumerators Disponíveis
- window.classEnum... -> usado no parametro carrer da função filter
- window.orderEnum... -> usado no parametro order ...
- window.goldJobEnum... -> usado no parametro job ...


-- window.classEnum --
- window.classEnum.All
- window.classEnum.Katrina
- window.classEnum.Mage
- window.classEnum.Ranger
- window.classEnum.Thief
- window.classEnum.Warrior


-- window.orderEnum --
- window.orderEnum.Gold
- window.orderEnum.ROI
- window.orderEnum.Cost

-- window.goldJobEnum --
- window.goldJobEnum.PartTime
- window.goldJobEnum.Winemaker
- window.goldJobEnum.Lumberjack
- window.goldJobEnum.ScrollScribe
- window.goldJobEnum.Hunting
- window.goldJobEnum.LegendaryField

- Exemplo do Filtro funcionando
![image](https://user-images.githubusercontent.com/3093089/143764424-03a4ec4d-59de-462d-b3f6-612433be706f.png)

