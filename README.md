# filterbinaryx

![image](https://user-images.githubusercontent.com/3093089/143764424-03a4ec4d-59de-462d-b3f6-612433be706f.png)

Script que facilita a busca pela oferta ideal dentro do mercado do binaryx

Para fazer o escaneamento é necessário executar no console do brownser o comando filter assim que o tamper monkey injetar o script na pagina do mercado do jogo (https://market.binaryx.pro)

- TamperMonkey Chrome: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
- TamperMonkey Edge: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd

<p>Para usar o script é simples só instalar a extensão do tamper monkey e importar ou copiar e colar o script (FilterBinaryx.js), o tamper monkey vai injetar o script na pagina no momento que ela carrega (F5) disponibilizando o comando filter no console (F12).</p>

Obs.: Caso não queira instalar o tamper monkey é só copiar todo conteudo do script e colar no console (F12) e dar enter e depois usar o filter com as ordenações que preferir, detalhe, toda vez que abrir o mercado vai ter que colar novamente.

O filtro possui alguns parametros para facilitar as buscas e ordenação das ofertas

Obs: as vezes pode demorar um pouco o processamento das ofertas devido a lag no mercado, evitem momentos de pico.
Qualquer dúvida só me procurar no discord, fiquem a vontade para mudar o script caso queiram fazer melhorias ou ajustes.

<p><h3>Exemplos</h3></p>

<p>Exemplo 1: filtrar as 30 top ofertas com o menor ROI (retorno do investimento)</br>
filter(30, null, null, null, null, null, null, window.orderEnum.ROI)</p>

<p>Exemplo 2: filtrar as 50 top ofertas com o maior ganho de gold até 3000 dolares</br>
filter(50, null, 3000, null, null, null, null, window.orderEnum.Gold)</p>

<p>Exemplo 3: filtrar as 20 top ofertas com o menor ROI dos bonecos Warrior</br>
filter(20, null, null, window.classEnum.Warrior, null, null, null, window.orderEnum.ROI)</p>

<p>Exemplo 4: filtrar as 40 top ofertas com até 35 dias de ROI dos bonecos Katrina ordenado por menor custo</br>
filter(40, null, null, window.classEnum.Katrina, null, 35, null, window.orderEnum.Cost)</p>

<p>Exemplo 5: filtrar as 10 top ofertas até 4 BNB que farmam no ScrollScribe que geram no minimo 1000 gold por dia ordena por Gold</br>
filter(10, 4, null, null, window.goldJobEnum.ScrollScribe, null, 1000, window.orderEnum.Gold)</p>

<p><h3>Enumerators Disponíveis</h3></p>
window.classEnum... -> usado no parametro carrer da função filter<br/>
window.orderEnum... -> usado no parametro order ...<br/>
window.goldJobEnum... -> usado no parametro job ...<br/>


<p><h3>window.classEnum</h3></p>
window.classEnum.All<br/>
window.classEnum.Katrina<br/>
window.classEnum.Mage<br/>
window.classEnum.Ranger<br/>
window.classEnum.Thief<br/>
window.classEnum.Warrior<br/>


<p><h3>window.orderEnum</h3></p>
window.orderEnum.Gold<br/>
window.orderEnum.ROI<br/>
window.orderEnum.Cost<br/>

<p><h3>window.goldJobEnum</h3></p>
window.goldJobEnum.PartTime<br/>
window.goldJobEnum.Winemaker<br/>
window.goldJobEnum.Lumberjack<br/>
window.goldJobEnum.ScrollScribe<br/>
window.goldJobEnum.Hunting<br/>
window.goldJobEnum.LegendaryField<br/>

<p><h4>Tambem é possivel fazer filtragens mais avançadas (antes de executar o filtro pela primeira vez)</h4></p>

window.agile = -1;<br/>
window.strength = -1;<br/>
window.constitution = -1;<br/>
window.willpower = -1;<br/>
window.intelligence = -1;<br/>
window.spirit = -1;<br/>
window.rarity = window.rarityEnum.All;<br/>
<br/>
window.page = 1;<br/>
window.pageSize = 99;<br/>
window.status = 'selling';<br/>
window.name = '';<br/>
window.sort = 'time';<br/>
window.direction = 'desc';<br/>
window.career = ''; <br/>
