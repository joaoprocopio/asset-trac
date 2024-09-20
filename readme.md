# Assets Trac

Seja bem-vindo! Esse é o repositório do Assets Trac.

Visite o site: https://assets-trac.pages.dev/

## Recursos úteis para desenvolvimento

Essa é uma aplicação [React](https://react.dev/), escrita com a linguagem [TypeScript](https://www.typescriptlang.org/).

O ambiente de produção está na [CloudFlare Pages](https://pages.cloudflare.com/) e todo push para o respositório roda uma [Pipeline de CI/CD](./.github/workflows/deploy.yml) que publica a nova versão.

## Como rodar o projeto?

Para que você possa rodar a aplicação em sua máquina, use os seguintes comandos:

```sh
npm install
npm run dev
```

## Showcase da aplicação

### Jaguar Unit

![](./videos/jaguar-unit.mp4)

### Tobias Unit

![](./videos/tobias-unit.mp4)

### Apex Unit

![](./videos/apex-unit.mp4)

## Quais pontos eu melhoraria se eu tivesse mais tempo?

Essa pergunta não é simples de responder, por que depende de muitas variáveis.
Para que um a boa resposta seja dada para essa pergunta é necessário que se saiba antes qual é o rumo que o projeto teria que tomar.

Por exemplo, se o rumo do projeto for ser entregue para usuários internacionais, eu colocaria esforços em fazer a internacionalização das interfaces do projeto.

Mas, mesmo sabendo disso, vou deixar anotado alguns pontos que eu trabalharia no projeto hoje, caso tivesse mais tempo para a entrega.

### Pontos gerais do projeto

- Esse projeto carece de testes unitários, ter mais testes unitários ajudariam a fazer alterações com mais confiança.

- [Testes de benchmark utilizando o `Vitest`](https://vitest.dev/api/#bench), como performance é um ponto crítico, principalmente para Apex Unit que necessita exibir cerca de 18 mil objetos, poder construir uma árvore com uma boa performance é de suma importância, e garantir que as métricas de performance não se alterem conforme o tempo é extremamente importante.

- [Testes E2E com Playwright](https://playwright.dev/), existem alguns fluxos de navegação que dependem muito da URL e de que algumas peças da tela sejam atualizadas, utilizando essa classe de testes eu consigo montar fluxos testados e garantir que eles sempre estarão funcionando.

### Pontos de usabilidade

- Toda vez que você faz uma busca de ativos, o caminho completo desse ativo é exibido. Mas existe um problema nisso, para um Ativo com muitos irmãos, ou em outras palavras um ativo com outros ativos no mesmo nível, os ativos do mesmo nível mesmo sem fazerem parte da busca continuam sendo exibidos.

Por exemplo ao entrar em Apex Unit e pesquisar por `location 2`, todos os irmãos de `location 2` serão exibidos.

```
- ROOT
  |
  ├── Location 1 [Location]
  |     |
  |     ├── Location 182 [Sub-Location]
  |     |     |
  |     |     ├── Location 2 [Sub-Location]
  |     |     |
  |     |     ├── Location 3 [Sub-Location]
  |     |     |
  |     |     ├── Location 4 [Sub-Location]
  |     |     |
  |
  ├── Location 183 [Location]
```

- Upload de imagem, hoje a mesma imagem que você fazer upload, vai ser exibida para todo e qual Ativo, Componente ou Localização.

- Hoje os nós da árvore que tem filhos não podem ser expandidos/minimizados, o que é uma feature extremamente interessante, já que existem ativos que tem muitos filhos.

- A filtragem poderia ser [Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) separado, com um ícone de filtragem, tendo dois botões que somente tem um título, não deixa muito claro para o usuário final que tipo de ação isso irá executar.

- A seleção de empresa poderia ser muito melhor caso fosse um [Select](https://www.radix-ui.com/primitives/docs/components/select#select), o que facilitaria até se a aplicação precisasse ser compatível com dispositivos mobile.

### Pontos sobre organização de código/estilística

- O componente `CompanyAssetsTree` é cheio de responsabilidades e bem complexo para se manter, talvez quebrar ele em peças menores ajude ele a se tornar mais fácil de ser trabalhado.

### Pontos sobre performance

- Existe bastante espaço para otimização dentro do Grafo que é utilizado para fazer a representação da árvore, principalmente no que tange a filtragem de nós e remontagem da árvore.

- O primeiro loading já exibe a árvore com todos os nós existentes, isso aumenta a quantidade de objetos a serem inseridos em memória e serem renderizados e calculados inicialmente, seria muito bom se a árvore fosse renderizada somente pelas raízes inicialmente, e somente construindo as sub-árvores ao clicar em um botão de expandir, por exemplo.
