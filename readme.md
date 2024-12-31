# Assets Trac

Seja bem-vindo! Esse é o repositório do Assets Trac.

Visite o site: https://assets-trac.pages.dev/
Veja o case: https://github.com/tractian/challenges/tree/main/front-end

## Recursos úteis para desenvolvimento

Essa é uma aplicação [React](https://react.dev/), escrita com a linguagem [TypeScript](https://www.typescriptlang.org/).

O ambiente de produção está na [CloudFlare Pages](https://pages.cloudflare.com/) e todo push para o respositório roda uma [Pipeline de CI/CD](./.github/workflows/deploy.yml) que publica a nova versão.

## Como rodar o projeto?

Para que você possa rodar a aplicação em sua máquina, use os seguintes comandos:

```sh
npm i -g 'pnpm@9.15.1'
pnpm install
pnpm dev
```

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

- Hoje os nós da árvore que tem filhos não podem ser expandidos/minimizados, o que é uma feature extremamente interessante, já que existem ativos que tem muitos filhos.

- A filtragem poderia ser [Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) separado, com um ícone de filtragem, tendo dois botões que somente tem um título, não deixa muito claro para o usuário final que tipo de ação isso irá executar.

- A seleção de empresa poderia ser muito melhor caso fosse um [Select](https://www.radix-ui.com/primitives/docs/components/select#select), o que facilitaria até se a aplicação precisasse ser compatível com dispositivos mobile.

### Pontos sobre organização de código/estilística

- O componente `CompanyAssetsTree` é cheio de responsabilidades e bem complexo para se manter, talvez quebrar ele em peças menores ajude ele a se tornar mais fácil de ser trabalhado.

### Pontos sobre performance

- O primeiro loading já exibe a árvore com todos os nós existentes, isso aumenta a quantidade de objetos a serem inseridos em memória e serem renderizados e calculados inicialmente, seria muito bom se a árvore fosse renderizada somente pelas raízes inicialmente, e somente construindo as sub-árvores ao clicar em um botão de expandir, por exemplo.
