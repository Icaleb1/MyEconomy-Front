Caso o projeto ainda não esteja aberto em uma IDE, siga um dos métodos abaixo para abrir:

Você pode obter o projeto de duas formas:

Clonando o repositório via Git

Se você tiver o Git instalado, abra um terminal e execute o comando:

git clone <URL-do-repositório>

Depois, abra a pasta clonada na sua IDE (exemplo: VS Code).

Recebendo o projeto compactado (ZIP)

Caso receba o projeto como um arquivo .zip, descompacte o conteúdo em uma pasta de sua preferência. Em seguida, abra essa pasta na sua IDE.

Instalando as dependências:

Com o projeto aberto na IDE, abra o terminal integrado (ou use o Git Bash, se preferir) e execute o seguinte comando:

npm install

Esse comando irá instalar todas as dependências necessárias para o funcionamento do projeto.

Executando o projeto:

Após a conclusão da instalação das dependências, execute o comando:

npm start

Esse comando iniciará o Expo CLI, que mostrará no terminal as opções para executar o sistema. Você poderá escolher entre:

Rodar no emulador Android (caso tenha o Android Studio instalado e configurado).

Rodar via navegador web (Expo Web).

Configuração da API (Importante):

Antes de rodar o app, é necessário configurar o endereço da API.

Abra o arquivo:

src/service/Api.js

Dentro dele, localize a seguinte linha:

const API_URL =
Platform.OS === 'android'
? 'http://ipDaSuaMáquina:3000/'
: 'http://localhost:3000/';

Substitua "ipDaSuaMáquina" pelo IP local da sua máquina.

Exemplo de como deve ficar (caso seu IP seja 192.168.0.100):

const API_URL =
Platform.OS === 'android'
? 'http://192.168.0.100:3000/'
: 'http://localhost:3000/';

Como descobrir seu IP local:

Se estiver usando Windows, abra o terminal (Prompt de Comando) e execute o comando:

ipconfig

Procure pelo campo chamado "Endereço IPv4". Esse será o IP a ser usado no arquivo Api.js.

Resumo dos passos:

Obtenha o projeto (via Git ou ZIP).

Abra o projeto na sua IDE.

No terminal, execute:

npm install

Após a instalação, execute:

npm start

Ajuste o IP da API no arquivo:

src/service/Api.js

Execute o sistema no emulador Android ou no navegador web, conforme desejar.