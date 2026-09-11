# Auditoria de motion mobile e plano de convergência com a referência

## Conclusão executiva

O mobile atual não perdeu identidade por falta de Lenis. Ele perdeu identidade porque várias cenas deixaram de usar o scroll como linguagem narrativa. Lenis melhora continuidade, sincronização e sensação de peso, mas não recria, por si só, pinning, sobreposição, transformação de layout ou deslocamento horizontal.

A referência confirma a estratégia mais adequada: manter no celular o gesto vertical e as principais relações espaciais do desktop, adaptando escala, duração, tipografia e quantidade de camadas. No trecho de cards de acampamentos, por exemplo, a versão mobile continua sendo uma cena pinned em que o scroll vertical move um trilho horizontal; não foi substituída por uma lista comum.[^1][^2]

A recomendação é:

1. habilitar Lenis em todo viewport com movimento normal, inclusive touch;
2. separar preferência de movimento, geometria de layout e tipo de ponteiro;
3. reaproveitar a timeline desktop de Territórios no mobile, com parâmetros compactos;
4. reintroduzir versões compactas das gramáticas de Camadas e Mapa → Onça;
5. preservar as versões mobile já boas de Hero, Arara e Epílogo, corrigindo apenas transições e densidade.

O melhor piloto é Territórios. A implementação desktop local já é estruturalmente muito próxima da solução usada pela referência em desktop e mobile. Isso reduz risco, tempo e quantidade de código novo.

## Escopo e método

A análise combinou quatro fontes:

- inspeção visual e de comportamento, em desktop e viewport mobile de 390 × 844, do site local e da versão publicada da White Desert;
- leitura das timelines, estilos, breakpoints e integração Lenis/GSAP do projeto;
- inspeção dos bundles públicos da referência, para confirmar breakpoints e configuração de scroll;
- confronto com a documentação oficial de Lenis e GSAP ScrollTrigger.

O objetivo não é copiar a geometria da referência. É identificar o princípio que permite preservar a mesma identidade cinematográfica em telas e entradas diferentes.

## Como a comparação conduz a melhor versão possível

Esta auditoria compara deliberadamente quatro experiências, e não apenas dois sites:

1. **Floresta Viva desktop × Floresta Viva mobile/tablet:** identifica quais movimentos, sobreposições e transformações já existem no projeto e quais foram removidos ou simplificados no layout compacto.
2. **White Desert desktop × White Desert mobile/tablet:** identifica quais animações a referência considera essenciais o bastante para preservar no touch e quais detalhes ela adapta ou elimina.
3. **Floresta Viva mobile × White Desert mobile:** mostra onde a referência mantém uma narrativa espacial — pinning, scroll horizontal dirigido pelo gesto vertical, passagem entre planos — enquanto o projeto atual volta ao fluxo estático.
4. **Síntese para a melhor versão possível:** aplica os princípios comprovados pela referência às cenas, ao conteúdo e à identidade próprios da Floresta Viva. A meta não é uma cópia; é fazer o mobile expressar a mesma ambição do desktop com uma coreografia adequada à tela e ao touch.

Cada reconstrução seguirá esse mesmo ciclo: observar o comportamento equivalente na referência desktop/mobile, registrar o verbo narrativo preservado, adaptar a cena local, comparar novamente em viewports equivalentes e só então considerá-la concluída.

## Passo a passo que seguiremos

### Etapa 1 — estabelecer e registrar o baseline

1. Gravar as cenas atuais em 390 × 844, 768 × 1024, 1024 × 768 e 1440 × 900.
2. Registrar, para cada cena, início, meio, fim, direção do movimento, pin, overlap e mudança de tema do cabeçalho.
3. Repetir o registro na White Desert desktop/mobile.
4. Usar essa comparação como referência visual de aceite, sem importar marca, conteúdo ou geometria literalmente.

**Saída:** matriz “preservar, adaptar ou simplificar” por cena e vídeos de antes.

### Etapa 2 — corrigir a fundação de motion

1. Separar `motionPreference`, `layout` e `pointer`.
2. Unificar os breakpoints usados por React, GSAP e CSS.
3. Habilitar Lenis em mobile/tablet quando a preferência for normal.
4. Manter um único ticker Lenis/GSAP e o fluxo nativo completo em reduced motion.
5. Validar âncoras, menu, rotação e refresh antes de reconstruir as cenas.

**Saída:** phone, tablet e desktop usam o mesmo motor de scroll; touch não é tratado como reduced motion.

### Etapa 3 — reconstruir Territórios como piloto

1. Compartilhar a timeline master do desktop com o mobile.
2. Preservar abertura em faixas, stage pinned, trilho horizontal e finale.
3. Parametrizar largura dos cards, tipografia e distâncias para phone/tablet.
4. Manter o gesto físico vertical e impedir overflow horizontal do documento.
5. Comparar lado a lado com a seção equivalente da White Desert no desktop e mobile.

**Saída:** primeira prova de que a identidade desktop pode sobreviver no touch com custo controlado.

### Etapa 4 — reconstruir Camadas da Vida

1. Transformar os cinco cards empilhados em um accordion vertical sticky.
2. Dividir o progresso do scroll em cinco estados estáveis.
3. Manter um card dominante e os demais comprimidos.
4. Preservar seleção por toque, foco e teclado.
5. Usar uma lista editorial apenas no fallback short landscape/reduced.

**Saída:** a metáfora visual de “camadas” volta a existir no mobile.

### Etapa 5 — reconstruir Mapa → Onça

1. Reunir introdução, mapa e onça em um único stage narrativo.
2. Desenhar a rota com scrub.
3. Aplicar zoom compacto e wipe para a onça.
4. Revelar olhos, texto e metadados em sequência.
5. Conferir a continuidade com o finale de Territórios e a entrada da Arara.

**Saída:** a rota volta a conduzir fisicamente o visitante até o animal.

### Etapa 6 — recuperar continuidade e densidade

1. Restaurar uma ponte 2D leve no Hero.
2. Recuperar máscara/scrub em Fôlego e Veias.
3. Preservar a coreografia mobile já boa da Arara.
4. Reintroduzir overlaps controlados entre Onça, Arara, Todo e Assinatura.
5. Revelar o texto do Epílogo progressivamente.

**Saída:** desaparecem os cortes secos que faziam as seções parecerem páginas isoladas.

### Etapa 7 — validar, medir e ajustar

1. Executar lint e build de produção.
2. Percorrer a matriz de viewports e reduced motion.
3. Testar scroll lento, flick rápido, reversão, rotação, menu e âncoras.
4. Medir LCP, long tasks, memória e estabilidade dos pins.
5. Comparar as gravações finais com o baseline local e com a referência desktop/mobile.
6. Reduzir apenas efeitos que falharem no orçamento, preservando o verbo principal de cada cena.

**Saída:** melhor versão possível dentro do orçamento real dos dispositivos, com evidência visual e técnica para cada simplificação.

## Diagnóstico principal

Hoje existem três sistemas de decisão que não concordam entre si:

- `use-motion-profile.ts` classifica como `compact` qualquer viewport até 900 px **ou qualquer dispositivo com ponteiro coarse**;
- `smooth-scroll.tsx` só instancia Lenis quando o perfil é `full`;
- várias cenas escolhem desktop ou mobile apenas por largura, com `gsap.matchMedia('(min-width: 901px)')`.

Isso cria uma inconsistência especialmente importante em tablet landscape. Um tablet com 1024 px e ponteiro coarse recebe layout/timeline desktop, mas scroll nativo porque seu perfil é `compact`. A cena foi projetada como uma unidade, mas seu motor de scroll e sua geometria são decididos por critérios diferentes.

Também há uma confusão conceitual entre `compact` e `reduced`. Compacto deveria significar “a mesma narrativa com menos distância, menos camadas e outra composição”. Reduced significa “sem pinning e sem scrub”. Na prática, algumas cenas compactas estão próximas demais do fallback de movimento reduzido.

## Comparação do site atual

| Cena | Desktop atual | Mobile/tablet atual | O que se perde |
|---|---|---|---|
| Hero | Vídeo, título, névoa, floresta e ponte de transição respondem ao scroll | Mantém sticky, vídeo, título, névoa e floresta; remove a ponte de transição | Parte da continuidade para a seção seguinte, mas a identidade principal sobrevive |
| Fôlego / Veias | Máscara e tipografia se transformam com scrub; imagem ganha profundidade | Parallax leve e entradas por fade | A frase deixa de ser matéria visual e passa a ser conteúdo revelado de forma genérica |
| Camadas da Vida | Um card dominante comprime os demais; interação muda foco, escala, filtro e texto | Cinco cards completos empilhados verticalmente | Desaparece a ideia de camadas/accordion e a descoberta progressiva |
| Territórios | Stage pinned, abertura em faixas, trilho horizontal, wipes e finale | Imagem de abertura seguida de cards verticais com fade | É a maior perda: transformação da seção, horizontalidade e passagem de planos deixam de existir |
| Mapa → Onça | Montagem pinned: névoa, troca de planos, desenho de rota, zoom e wipe para a onça | Blocos verticais com entradas pontuais | A rota deixa de conduzir fisicamente à onça; surgem cortes duros entre cenas |
| Arara | Voo, rastros, texto e saída em sete faixas com sobreposição de cenas | Sticky de 145svh, voo, rastros e saída em cinco faixas | Pouco: é a melhor adaptação mobile; perde principalmente a sobreposição com a cena anterior |
| Todo / Epílogo | Panorama pinned, noite, linhas de texto, metadados, pulso e fade de saída | Sticky de 135svh, escala/noite/pulso sutis; texto quase todo presente desde cedo | Menos progressão dramática e transição mais seca para a assinatura |

A consequência é perceptiva: Hero, Arara e Epílogo ainda parecem partes de uma experiência; Camadas, Territórios e Mapa parecem páginas editoriais inseridas entre essas experiências.

## Comparação com a referência

A White Desert não mantém absolutamente toda ornamentação do desktop. Ela simplifica efeitos secundários e muda composição quando necessário. O que ela preserva são as relações que definem cada cena.[^1]

### O que permanece no mobile da referência

- O hero continua em tela cheia, com vídeo, título, névoa e revelação progressiva controlados pelo scroll.
- A seção de acampamentos continua pinned e horizontal. O usuário faz um gesto vertical comum, mas os cards atravessam a tela horizontalmente.
- A abertura da seção ainda é construída por três faixas, seguida do deslocamento do trilho e de uma transição final.
- A narrativa continua sendo conduzida por cenas e não apenas por entradas `fade-up`.

A inspeção do bundle confirma que a timeline horizontal mede `track.scrollWidth - window.innerWidth`, reserva uma introdução de aproximadamente `1.5 × viewportHeight`, uma revelação de `1 × viewportHeight` e duração horizontal proporcional a `1.5 × horizontalDistance`. O breakpoint altera principalmente tamanho tipográfico; a timeline pinned não é eliminada no mobile.[^2]

### O que a referência simplifica

- efeitos genéricos de parallax e algumas variações decorativas são condicionados ao breakpoint;
- listas menos narrativas podem virar cards verticais;
- direções, tamanhos e densidade de camadas mudam no mobile;
- touch não é convertido em um carrossel horizontal que exige gesto lateral.

O princípio é: **preservar o verbo da cena e reduzir seus advérbios**. Se a cena “atravessa”, continua atravessando. Se “sobrepõe”, continua sobrepondo. O que muda é quanto, por quanto tempo e com quantas camadas.

## O papel correto do Lenis

A referência mantém um provider Lenis raiz também no mobile. A configuração pública observada usa `autoRaf: false`, `syncTouch: true`, `syncTouchLerp: 0.075`, `touchInertiaExponent: 1.7` e `touchMultiplier: 1`, sincronizada ao ticker do GSAP e a `ScrollTrigger.update()`.[^3]

O projeto local já tem praticamente essa integração. O problema é o bloqueio `motionProfile !== 'full'`, que devolve compact/touch ao scroll nativo. Portanto, não é necessário trocar de biblioteca ou criar um segundo loop; é necessário retirar o acoplamento entre touch e “sem Lenis”.

Lenis oficialmente fornece integração direta com ScrollTrigger e preserva recursos nativos como sticky, acessibilidade e scroll nativo em sua arquitetura.[^4] A própria documentação alerta, porém, que `syncTouch` pode ser instável em iOS anteriores ao 16 e que Safari pode reduzir a taxa de atualização em modos específicos.[^4] Isso pede fallback dirigido por capacidade/versão observada, não a remoção global de smooth scroll no mobile.

### Configuração recomendada

- instanciar Lenis quando `motionPreference === 'normal'`, independentemente de `pointer: coarse`;
- manter um único RAF: GSAP ticker → `lenis.raf()` → `ScrollTrigger.update()`;
- manter `autoRaf: false`, `smoothWheel: true` e a configuração touch já adotada;
- deixar `prefers-reduced-motion: reduce` fora de Lenis e de timelines pinned/scrubbed;
- manter refresh após mudança real de largura/orientação e após fontes/imagens críticas;
- feature-gate ou desativar `syncTouch` apenas onde testes físicos revelarem falha, sobretudo iOS antigo;
- não adicionar `ScrollTrigger.normalizeScroll()` na primeira etapa. Ele intercepta o scroll para contornar problemas de browser e deve ser tratado como experimento de último recurso, não como pré-requisito.[^5]

`ignoreMobileResize: true`, já presente no projeto, ajuda a evitar recomputações causadas pela barra de endereço mobile, mas a documentação observa que isso troca estabilidade por possível imprecisão de posições. Por isso, a rotação de tela precisa continuar provocando um refresh deliberado.[^6]

## Nova arquitetura responsiva de motion

As decisões devem ser separadas em três eixos:

| Eixo | Valores sugeridos | Decide |
|---|---|---|
| Preferência | `normal`, `reduced` | Se scrub, pin e smooth scroll podem existir |
| Layout | `phone`, `tablet`, `wide`, `shortLandscape` | Distâncias, proporções, tipografia e composição |
| Entrada | `coarse`, `fine`, `hover` | Hover, cursor, affordance e precisão de interação |

Breakpoints iniciais sugeridos:

- `phone`: até 639 px;
- `tablet`: 640–1023 px;
- `wide`: 1024 px ou mais;
- `shortLandscape`: altura até 700 px e orientação landscape.

Esses limites devem virar tokens compartilhados por React, GSAP e CSS. `gsap.matchMedia()` oferece condições múltiplas e faz revert automático do contexto quando a condição muda, sendo apropriado para essa arquitetura.[^7]

Ponteiro coarse não deve decidir sozinho a timeline. Um iPad landscape pode comportar a geometria wide, ainda que não tenha hover. Da mesma forma, uma janela estreita com mouse precisa usar composição compacta, embora preserve interações de ponteiro.

## Proposta por cena

### 1. Territórios — prioridade máxima

Reutilizar a timeline master desktop também em phone e tablet. A implementação local já tem os mesmos elementos estruturais confirmados na referência: introdução, revelação em três retângulos, trilho horizontal, `containerAnimation`, wipe e finale.

Parâmetros iniciais para mobile:

- cards com 82–86vw de largura e 66–74svh de altura;
- gap de 4–6vw;
- stage de 100svh;
- duração total equivalente a aproximadamente 430–550svh, calculada pela largura real do trilho;
- título entre 1.9rem e 2.3rem;
- entrada em três faixas preservada, mas com amplitude menor;
- fundo/finale simplificado para uma camada de textura e uma camada de cor;
- `ease: 'none'` no movimento do container, requisito importante para `containerAnimation` confiável.[^8]

O scroll físico continua vertical. Não usar swipe lateral obrigatório e não criar scroll horizontal real no documento. O trilho é transformado por `translate3d` enquanto a seção está pinned.

### 2. Camadas da Vida — recuperar a gramática de accordion

No mobile, não é preciso copiar os cards estreitos do desktop. É preciso manter a alternância entre um card dominante e cards comprimidos.

Proposta:

- seção de 360–460svh com stage sticky de 100svh;
- card ativo ocupando 58–68svh;
- cards inativos como faixas de 44–56px, ainda identificáveis por número/título;
- cinco intervalos de progresso; cada intervalo troca o card ativo;
- a troca anima `flex-basis`/grid rows, imagem, overlay e texto;
- tap, teclado e foco continuam permitindo seleção direta;
- mudanças de estado ocorrem nos limiares, não em todo frame do scrub.

Em `shortLandscape`, usar apenas o card ativo com prévia do próximo, ou voltar a uma lista curta. Esse é um fallback geométrico, não uma redução global de movimento.

### 3. Mapa → Onça — reconstruir a ligação narrativa

Criar uma montagem compacta pinned/sticky de 180–240svh com três batidas:

1. introdução e névoa;
2. mapa com rota desenhada e zoom moderado;
3. wipe/reveal da onça, seguido por olhos e texto.

O zoom do mapa pode cair de 1.52 no desktop para 1.15–1.22 no mobile. Uma única camada de wipe e uma névoa leve são suficientes. O objetivo é fazer a rota chegar à onça sem o corte duro observado hoje.

Em landscape baixo, a mesma sequência pode virar fluxo normal com uma transição curta, evitando pin excessivamente comprido.

### 4. Hero — manter e completar

O hero mobile atual já preserva boa parte da linguagem. Não deve ser refeito. Recomenda-se:

- manter o sticky de 180svh e a timeline atual;
- restaurar uma ponte de transição 2D leve, com duas ou três camadas de névoa/clip;
- evitar rotação 3D e blur animado em tela cheia;
- garantir que a saída já revele parte da próxima cena, eliminando o intervalo que parece vazio.

### 5. Fôlego / Veias — devolver materialidade ao texto

Trocar os fades genéricos por uma versão compacta da máscara/scrub do desktop:

- clip ou mask da afirmação acompanhando 50–80svh de scroll;
- imagem com escala entre 1.00 e 1.07;
- duas fases de texto, não vários reveals independentes;
- sem pin longo.

### 6. Arara — preservar, não reinventar

Esta é a adaptação mobile mais bem-sucedida. Manter voo, rastros, sticky e saída em cinco faixas. Ajustes:

- restaurar sobreposição de aproximadamente 20–35svh com a saída da Onça;
- reforçar levemente a entrada da ave;
- conservar cinco faixas no mobile, em vez de voltar às sete do desktop.

### 7. Todo / Epílogo e assinatura

Manter o sticky compacto, mas recuperar progressão:

- revelar texto por linha ou por dois blocos, em vez de deixá-lo quase todo visível;
- manter escala/noite/pulso atuais;
- reintroduzir 20–30svh de sobreposição com a Arara e uma passagem parcial para a assinatura;
- evitar um segundo pin longo no final.

## Transições entre cenas

Além das timelines internas, há uma perda sistemática de continuidade porque `margin-top` negativo e carryovers são removidos no mobile. O resultado são junções visíveis entre Mapa, Onça, Arara, Todo e Assinatura.

A solução não é sobrepor tudo. Deve existir um orçamento explícito:

- cenas signature: 20–35svh de overlap;
- cenas editoriais: 8–16svh;
- nenhum overlap em reduced motion e short landscape;
- no máximo duas cenas pesadas vivas simultaneamente.

As sobreposições devem animar wrappers internos, não o elemento usado como pin spacer. A documentação do ScrollTrigger recomenda não animar o próprio elemento pinned, pois isso altera as medições.[^8]

## Performance e acessibilidade

Preservar motion no mobile exige reduzir custo por frame, não eliminar a narrativa.

### Orçamento técnico

- priorizar `transform`, `opacity` e `clip-path` simples;
- evitar `filter: blur()` animado em imagens full-screen;
- promover com `will-change` apenas a cena ativa e limpar propriedades ao sair;
- não chamar `setState` em cada `onUpdate`; usar propriedades GSAP e trocar estados apenas em limiares;
- usar `next/image` com `sizes` coerente e variantes mobile quando a fonte for muito maior que a área renderizada;
- pausar mídia e timelines fora da vizinhança do viewport;
- limitar a duas ou três camadas full-screen simultâneas;
- usar `anticipatePin`/`fastScrollEnd` apenas após medir o problema que resolvem.

### Acessibilidade

- `prefers-reduced-motion` deve remover pin, scrub, parallax, smooth scroll e overlaps, preservando todo conteúdo em fluxo normal;
- cards precisam continuar acessíveis por teclado e toque, independentemente do scroll;
- nenhum conteúdo pode depender de hover;
- o trilho horizontal deve responder a scroll vertical e não aprisionar gestos;
- âncoras e foco programático precisam chamar a API de scroll de forma consistente.

## Ordem de implementação

### P0 — fundação

1. Criar os três eixos de capability e queries compartilhadas.
2. Instanciar Lenis em `normal`, inclusive mobile/tablet.
3. Corrigir o caso tablet landscape: layout e engine deixam de divergir.
4. Criar markers de debug e um roteiro fixo de capturas/gravações.

### P1 — cenas que recuperam identidade

1. Territórios como piloto.
2. Mapa → Onça.
3. Camadas da Vida.

### P2 — continuidade e polimento

1. Hero → Fôlego.
2. Fôlego / Veias.
3. Onça → Arara → Todo → Assinatura.

### P3 — endurecimento

1. Fallback de short landscape.
2. Ajustes de iOS e Android físicos.
3. Orçamento de mídia/camadas e correções de regressão.
4. Atualização da documentação de motion e responsividade.

## Matriz de validação

| Viewport/capacidade | Objetivo principal |
|---|---|
| 360 × 800 touch | menor phone suportado; ausência de overflow e textos cortados |
| 390 × 844 touch | viewport de referência da auditoria; continuidade completa |
| 430 × 932 touch | phone grande; distâncias não podem ficar lentas demais |
| 768 × 1024 touch | tablet portrait; accordion e trilho devem ganhar espaço sem mudar de linguagem |
| 1024 × 768 coarse | tablet landscape; valida a correção da divergência atual |
| 1366 × 768 fine | desktop baixo; pins e tipografia não podem colidir |
| 1440 × 900 fine | baseline desktop |
| qualquer viewport + reduced | conteúdo completo, sem pin/scrub/smooth scroll |

Testes manuais obrigatórios:

- flick rápido para frente e para trás;
- inversão de scroll no meio de cada wipe;
- rotação portrait/landscape;
- abrir/fechar menu durante uma cena pinned;
- navegação por âncora e por teclado;
- voltar do bfcache;
- Safari iPhone e Chrome Android físicos;
- modo de pouca energia e aba retomada após background.

## Critérios de aceite

- Mobile e desktop apresentam as mesmas batidas narrativas, ainda que com geometria diferente.
- Territórios volta a ser uma transformação horizontal dirigida por scroll vertical.
- Camadas mantém um estado dominante por vez.
- A rota do mapa conduz visualmente à onça.
- Não existem cortes secos não intencionais entre Onça, Arara, Todo e Assinatura.
- Não há overflow horizontal do documento, scroll trap, salto de pin ou conteúdo inacessível.
- Cabeçalho, tema e capítulos continuam sincronizados durante pins longos.
- Reduced motion apresenta todo o conteúdo em fluxo estático.
- O baseline de LCP mobile do projeto continua dentro da meta de 2,5 s e a experiência não introduz long tasks perceptíveis.

## Decisão recomendada

Avançar com um protótipo vertical de Territórios antes de mexer em todas as cenas. Ele deve compartilhar a timeline desktop, receber parâmetros compactos e rodar com Lenis habilitado em touch. A referência prova que essa gramática funciona no mobile, e o código local já contém quase toda a estrutura necessária.

Se esse piloto passar a matriz de 390 × 844, 768 × 1024 e 1024 × 768 coarse, a mesma arquitetura de capabilities deve ser aplicada a Mapa → Onça e Camadas. Essa ordem recupera primeiro as maiores perdas de identidade e evita uma reescrita ampla sem evidência.

## Estado de execução

- [x] Comparação Floresta Viva desktop/mobile.
- [x] Comparação White Desert desktop/mobile.
- [x] Registro das perdas e dos princípios que a referência preserva no touch.
- [x] Separação entre preferência de movimento, layout e tipo de ponteiro.
- [x] Lenis habilitado em viewports touch com movimento normal.
- [x] Breakpoint principal unificado em 1024 px para CSS e timelines.
- [x] Territórios reconstruído como trilho horizontal pinned no mobile/tablet.
- [x] Camadas compacta reconstruída como sequência de cards abertos em fluxo normal, sem pin, seguindo o padrão de `Our Trips`; o accordion permanece apenas no layout wide.
- [x] Mapa → Onça reconstruído como montagem pinned compacta.
- [x] Ponte mobile do Hero e máscaras de Fôlego/Veias restauradas.
- [x] Progressão do Epílogo e overlaps entre cenas restaurados.
- [x] Fallbacks de reduced motion e short landscape preservados.
- [x] Lint, TypeScript e build de produção.
- [x] Validação visual assistida completa nos viewports 390 × 844, 768 × 1024 e 1024 × 768. Os bloqueios encontrados em 10 de setembro foram corrigidos e revalidados em 11 de setembro de 2026.
- [ ] Repetição específica de 1024 × 768 com `pointer: coarse` real ou emulação equivalente.
- [ ] Validação física completa em Safari iPhone e Chrome Android.
- [ ] Ajuste fino de duração, proporção e overlap a partir das gravações em dispositivos reais.

Os três itens finais são deliberadamente validação e calibração, não outra troca de arquitetura. Se um dispositivo exigir simplificação, deve-se reduzir distância, camada ou resolução sem remover a ação principal que define a cena.

## Rodada de validação visual assistida — 10 de setembro de 2026

### Ambiente e limites da rodada

- Prévia local em Next.js dev, Chrome, movimento normal e viewport explícito controlado pelo navegador.
- Viewports percorridos: 390 × 844, 768 × 1024 e 1024 × 768.
- O navegador disponível expôs apenas controle de viewport. Em 1024 × 768, `pointer: fine` permaneceu ativo; portanto, a geometria wide, o Lenis e as timelines foram validados, mas a combinação física `pointer: coarse` continua pendente.
- O indicador de desenvolvimento exibiu um hydration mismatch provocado pela extensão do navegador, que adicionou `cz-shortcut-listen` ao `<body>`. Não houve erro de runtime atribuído ao código da experiência nesta rodada.

### Resultado por viewport

| Viewport | Resultado | Evidência principal |
|---|---|---|
| 390 × 844 | Reprovado com bloqueio localizado | Hero, Fôlego/Veias, Camadas, Territórios, Arara, Inteiro e Silêncio mantêm composição, progressão e continuidade. Não houve overflow horizontal (`scrollWidth = clientWidth = 390`). O wipe Mapa → Onça, porém, contém um stage vazio e pode saltar diretamente para a entrada da Arara. |
| 768 × 1024 | Reprovado com bloqueio localizado | Territórios mantém abertura, trilho horizontal e finale; Camadas responde a scroll e seleção direta; não houve overflow horizontal (`scrollWidth = clientWidth = 768`). No meio do pin de Mapa → Onça, o mapa já está invisível e a Onça continua 102% abaixo do stage. |
| 1024 × 768 | Aprovado visualmente com ressalvas | A geometria wide entra exatamente em 1024 px, Lenis permanece ativo, Camadas horizontal funciona por clique e teclado, Territórios percorre o trilho e Mapa → Onça revela a Onça. Não houve overflow horizontal (`scrollWidth = clientWidth = 1024`). Restam a validação coarse real e o ajuste das âncoras em cenas sobrepostas. |

### O que passou

- Hero preserva enquadramento, título, CTA e ponte para a cena seguinte nos três tamanhos.
- Territórios permanece pinned e horizontal nos três tamanhos; os cards atravessam a tela por scroll vertical, o finale ocupa o stage e o documento não cria barra horizontal.
- Camadas troca um único estado dominante por vez. Clique/toque simulado atualiza `aria-pressed`; em 1024 × 768, `ArrowRight` moveu foco e estado ativo para o card seguinte, com foco visível.
- O menu compacto coube em 390 × 844 com lista interna rolável e CTA final acessível; em 768 × 1024 todos os capítulos couberam simultaneamente.
- A cena da Arara, o wipe em faixas para Inteiro, a progressão textual do epílogo e a assinatura final permaneceram legíveis nos três viewports.
- Cabeçalho/capítulo acompanharam as cenas durante os pins observados, inclusive Territórios, Camadas, Olhos, Asas e Inteiro.

### Bloqueios encontrados

#### P0 — o wipe compacto Mapa → Onça perde a Onça

Em 390 × 844 e 768 × 1024, existe um intervalo em que `data-map-layout` já está com `opacity: 0`, enquanto `data-map-jaguar-reveal` continua com `transform: translate(0%, 102%)`. Em 768 × 1024, isso foi observado com o pin aproximadamente 61% percorrido: o viewport inteiro ficou apenas com o fundo marfim e a grade. Próximo ao fim do pin, a Arara já ocupava a parte inferior do viewport e a Onça ainda permanecia fora do stage.

O comportamento não ocorreu em 1024 × 768: nesse layout, o wrapper chegou a `translate3d(0, 0, 0)` e a Onça foi revelada. A hipótese mais forte é a dupla propriedade do transform no compacto: o CSS já inicia `.mapJaguarReveal` em `translate3d(0, 102%, 0)` e a timeline também inicializa/anima `yPercent`. A correção deve dar a uma única camada a propriedade desse deslocamento e manter um hold real da Onça, sem um segundo tween redundante para o mesmo `yPercent`.

#### P1 — âncoras internas não apontam para um beat estável

- Uma carga direta em `#olhos` não convergiu para o mesmo quadro entre os layouts: no compacto pôde parar na introdução do mapa; em 1024 × 768 parou quando a Arara já cobria a parte inferior da Onça.
- Uma carga direta em `#asas` em 1024 × 768 mostrou apenas o fundo da cena até o primeiro avanço de scroll.
- A navegação pelo menu durante a sessão convergiu melhor após o Lenis terminar, mas não elimina a inconsistência de carga direta ou de retorno por histórico.

As âncoras de cenas pinned/sobrepostas precisam apontar para offsets narrativos explícitos, não apenas para o topo geométrico do elemento.

#### P1 — títulos dos cards inativos de Camadas ficam truncados no compacto

Em 390 × 844 e 768 × 1024, os cards inativos são faixas horizontais, mas o nome continua com `writing-mode: vertical-rl` e `rotate(180deg)`. O resultado visível são apenas sufixos como “NHA”, “RICA” e “HA”; alguns números e nomes de camada também desaparecem conforme a posição do card. Em 768 × 1024, o estado computado confirmou `writing-mode: vertical-rl`, apesar da regra compacta pretender restaurar `horizontal-tb`.

A interação e o estado acessível continuam corretos, mas o critério visual de identificar cada faixa por número/título ainda não passa.

### Plano da rodada seguinte, registrado em 10 de setembro

1. Corrigir a propriedade do transform no wipe compacto e repetir o percurso natural Mapa → Onça → Arara em 390 × 844 e 768 × 1024.
2. Definir offsets de destino para `#olhos`, `#asas` e `#inteiro`, incluindo carga direta, menu, retorno do histórico e bfcache.
3. Corrigir a cascata dos nomes inativos de Camadas e confirmar que as cinco faixas continuam identificáveis durante todos os estados.
4. Repetir 1024 × 768 em hardware coarse ou em um navegador que permita emular `pointer: coarse`, incluindo flick, reversão, rotação e abertura do menu durante o pin.

## Rodada de correção e revalidação — 11 de setembro de 2026

### Correções aplicadas

- O wrapper Mapa → Onça agora tem o deslocamento vertical assumido integralmente pelo GSAP: a inicialização zera o componente `y` herdado do transform compacto e aplica apenas `yPercent: 102`. O segundo tween redundante de `yPercent` foi substituído por um hold neutro da timeline.
- `#olhos`, `#asas` e `#inteiro` receberam progressos narrativos explícitos (`0.60`, `0.58` e `0.50`). O controlador de scroll resolve o `ScrollTrigger` pinned que contém o alvo e navega para `start + distância × progresso`, em vez de usar somente o topo geométrico do elemento.
- A resolução das âncoras é reaplicada em carga inicial, `hashchange`, `popstate` e `pageshow` restaurado por bfcache. O salto imediato força também uma atualização síncrona do ScrollTrigger.
- A regra compacta dos nomes inativos de Camadas ganhou especificidade equivalente à regra desktop e restaura explicitamente `writing-mode: horizontal-tb` e `transform: none`.

### Resultado da revalidação

| Viewport | Resultado | Evidência principal |
|---|---|---|
| 390 × 844 | Aprovado no escopo assistido | O percurso natural Mapa → Onça → Arara não produz mais quadro vazio: a Onça chega a `translateY(0)`, permanece no hold e só então cede espaço à Arara. Cargas diretas em Olhos, Asas e Inteiro chegaram a quadros completos. Os cinco nomes de Camadas permaneceram horizontais e legíveis. |
| 768 × 1024 | Aprovado no escopo assistido | No antigo ponto de falha, com o pin em 60,9%, o mapa estava oculto e a Onça ocupava todo o stage com transform zerado. Olhos e Inteiro convergiram por carga direta; os cinco nomes de Camadas ficaram em `horizontal-tb`, sem rotação. |
| 1024 × 768 | Aprovado visualmente com ressalva coarse | Olhos, Asas e Inteiro convergiram por carga direta para os progressos definidos, com texto e imagens revelados. Em Inteiro, a assinatura começa exatamente abaixo do viewport no destino (`top = 768`), sem cobrir a composição. O ponteiro continuou `fine`; a validação coarse real permanece pendente. |

- O fluxo do menu compacto para `#olhos` fechou o diálogo e chegou ao beat da Onça. O retorno pelo histórico restaurou `#camadas` no topo correto e manteve os nomes horizontais.
- Não houve overflow horizontal nas amostras finais dos três viewports.
- `npm run lint` passou sem ocorrências.
- `npm run build` passou com compilação, TypeScript e geração estática concluídos pelo Next.js 16.3.4.
- O console não apresentou erro atribuível à aplicação. Permaneceram avisos da extensão do navegador, o mismatch causado por `cz-shortcut-listen` e avisos de LCP do Next dev ao carregar diretamente capítulos profundos.

### Status após a rodada

- **P0 Mapa → Onça: encerrado** nos dois layouts compactos.
- **P1 âncoras narrativas: encerrado** para carga direta, menu e histórico; o handler de bfcache foi implementado, mas a reprodução física continua incluída no reteste de dispositivos.
- **P1 nomes de Camadas: encerrado** em 390 × 844 e 768 × 1024.
- Restam somente o ensaio coarse real em 1024 × 768, Safari iPhone, Chrome Android e o ajuste fino a partir de gravações físicas.

## Rodada complementar a partir das observações — 11 de setembro de 2026

### Correção da leitura de referência para Camadas

A comparação desta rodada separou duas cenas diferentes da White Desert. `Our Camps`, usada como referência estrutural na auditoria inicial, preserva uma montagem horizontal/pinned. Já `Our Trips`, apontada nesta revisão, usa no mobile cards grandes, todos abertos, empilhados no fluxo normal do documento. O título também ocupa seu próprio intervalo editorial e não fica preso enquanto os cards mudam de estado.

Essa observação substitui o critério anterior de accordion sticky para **Camadas no layout compacto**. A versão wide continua usando o accordion horizontal por hover, foco e teclado; phone e tablet passam a seguir o padrão de `Our Trips`:

- stage com altura automática e sem pin;
- cinco cards abertos, cada um próximo da altura do viewport;
- todo o conteúdo de cada espécie disponível sem toque prévio;
- entrada vertical e parallax leve das imagens sincronizados ao ScrollTrigger;
- deslocamento físico suavizado pelo provider Lenis global;
- fallback de movimento reduzido integralmente estático.

### Correções aplicadas

- **“Um organismo vivo”:** o tween compacto usava `from({ strokeDashoffset: 520 })` sobre paths cujo valor CSS calculado já era `520`; início e fim eram idênticos. A cena agora anima explicitamente de `520` para `0`, revela o texto junto do desenho e usa o próprio kicker como gatilho.
- **Camadas:** foi removido o ScrollTrigger que fixava o stage e convertia progresso em índice ativo. No compacto, os cards agora permanecem completos em fluxo normal, com reveal vertical curto e parallax de imagem. A seleção continua disponível para foco/toque, mas não comprime os outros cards. O layout wide não foi alterado.
- **Onça → Arara:** a entrada compacta da Arara recebeu um wipe vertical por `clip-path`, que sobe junto com a seção sobreposta e termina quando o stage alcança o topo.
- **Arara → Inteiro:** as faixas de saída usavam `object-fit: contain`, mostrando somente uma faixa horizontal da imagem e grandes áreas verdes vazias. Com `object-fit: cover`, as cinco colunas recompõem o panorama em tela cheia e entregam a mesma imagem ao início de Inteiro.
- **Inteiro → Silêncio:** o overlap de `24svh` e a revelação progressiva da assinatura foram mantidos; a nova cobertura da transição anterior elimina o corte visual que fazia esse encadeamento parecer separado.

### Revalidação visual e técnica

| Viewport | Resultado | Evidência principal |
|---|---|---|
| 390 × 844 | Aprovado | Camadas mede aproximadamente `4005px`, contém cinco cards de `692px`, não cria `pin-spacer` e mantém `scrollWidth = clientWidth = 390`. O HTML permanece com a classe `lenis`. |
| 768 × 1024 | Aprovado | Camadas mede aproximadamente `4294px`, contém cinco cards de `736px`, permanece em fluxo normal e não cria overflow horizontal. |
| 1024 × 768 | Aprovado sem regressão | O breakpoint wide mantém o accordion horizontal, com um card dominante e interação por foco/clique. |

- Em 390 × 844 e 768 × 1024, os dois paths de “Um organismo vivo” terminaram com `strokeDashoffset: 0`; texto, traço e título ficaram visíveis no destino de `#folego`.
- Em phone e tablet, o percurso natural Onça → Arara mostrou a Arara subindo sobre a Onça; a saída em cinco faixas ocupou toda a altura antes de revelar Inteiro.
- Inteiro manteve a progressão de metadados, linhas e pulso. Silêncio continuou entrando por sobreposição, com capítulo, regra, marca e assinatura revelados em sequência.
- Não foi encontrado erro de runtime atribuível à aplicação. O único erro registrado em desenvolvimento continuou sendo o hydration mismatch causado pelo atributo `cz-shortcut-listen` injetado pela extensão do navegador.
- `npm run lint` e `npm run build` passaram; o build de produção concluiu TypeScript, geração estática e otimização da rota `/`.

### Status após esta rodada

- **P0 “Um organismo vivo”: encerrado** em phone e tablet.
- **P0 Camadas sem pin no compacto: encerrado** em 390 × 844 e 768 × 1024.
- **P1 continuidade Onça → Arara → Inteiro → Silêncio: encerrado** no escopo visual assistido de phone e tablet.
- Permanecem pendentes os ensaios físicos em Safari iPhone, Chrome Android e 1024 × 768 com `pointer: coarse` real.

## Reabertura e correção estrutural dos overlaps finais — 11 de setembro de 2026

### Por que o P1 foi reaberto

A inspeção quadro a quadro mostrou que a aprovação anterior confundiu **sobreposição geométrica** com **sobreposição visual**. No compacto, os `margin-top` negativos de `22–24svh` colocavam duas caixas na mesma região do documento, mas a próxima imagem continuava entrando por uma borda horizontal opaca. Na passagem Onça → Arara, o `clip-path` acompanhava exatamente o topo geométrico da própria Arara. Arara → Inteiro e Inteiro → Silêncio repetiam o mesmo corte perceptivo.

O Lenis estava ativo e sincronizado durante a falha. Portanto, o problema não era suavização do deslocamento, mas propriedade e composição das camadas animadas.

### Correções aplicadas

- **Onça → Arara:** o overlap compacto passou de `24svh` para um viewport completo. A Onça permanece no stage pinned enquanto a Arara sobe sobre ela. O wipe continua dirigido pelo scroll, mas agora combina `clip-path`, máscara feathered variável de `16svh → 0` e uma borda atmosférica de névoa. A linha horizontal deixa de ser identificável mesmo com as duas imagens em alto contraste.
- **Arara → Inteiro:** as cinco faixas continuam reconstruindo o panorama, mas ao fecharem removem bordas e sombras e o stage da Arara dissolve sobre o panorama real do Inteiro, já alinhado por baixo. Isso elimina as emendas verticais e o fragmento remanescente da Arara no topo do próximo quadro.
- **Inteiro → Silêncio:** phone e tablet agora usam um único `epilogueStage` pinned. Inteiro e Silêncio são planos absolutos de viewport inteiro dentro desse stage; o Silêncio sobe com scrub, máscara feathered de `16svh → 0` e névoa de transição enquanto o Inteiro permanece imóvel atrás.
- **Progressão do epílogo:** texto, pulso, noite, metadados e assinatura passaram a fazer parte da mesma timeline compacta. O capítulo do cabeçalho muda para Silêncio somente quando o plano já domina a leitura.
- **Âncoras:** `#inteiro` usa progresso compacto `0.36` e preserva `0.50` no wide. `#silencio` usa progresso `0.90`, chegando com a assinatura praticamente concluída.
- **Escopo responsivo:** a nova montagem compartilhada fica restrita a `compactCinematic`. A timeline wide anterior foi preservada; `shortLandscape` e `prefers-reduced-motion` continuam em fluxo normal, sem máscaras ou pin compartilhado.

### Revalidação visual e técnica

| Viewport | Resultado | Evidência principal |
|---|---|---|
| 390 × 844 | Aprovado | No meio de Onça → Arara, a Onça permanece em `top ≈ 0` enquanto a Arara ocupa o plano frontal com feather de aproximadamente `6.6svh`; não há linha de corte. O percurso chega ao panorama sem emendas e mantém `scrollWidth = clientWidth = 390`. |
| 768 × 1024 | Aprovado | A Onça permanece pinned enquanto a Arara entra com feather de aproximadamente `5svh`; as âncoras de Inteiro e Silêncio chegam a quadros completos e `scrollWidth = clientWidth = 768`. |
| 1024 × 768 | Aprovado sem regressão | O breakpoint wide continua usando a timeline original. `#inteiro` chega com todas as linhas reveladas, `#silencio` permanece em fluxo relativo e a borda atmosférica compacta fica com `display: none`. |

- O percurso foi testado para frente e para trás. Na reversão, Silêncio retorna a `yPercent: 100`, a máscara volta a `16svh` e o conteúdo de Inteiro recupera opacidade total; o mesmo ocorre entre Inteiro e as faixas da Arara.
- Lenis permaneceu ativo nos dois viewports compactos.
- Não foi observado overflow horizontal.
- `npm run lint`, `tsc --noEmit`, `git diff --check` e `npm run build` passaram. O build de produção concluiu compilação, TypeScript, geração estática e otimização da rota `/`.

### Status após a reabertura

- **P1 continuidade Onça → Arara → Inteiro → Silêncio: encerrado novamente**, agora com camadas compartilhadas, máscaras feathered, teste de reversão e evidência nos três breakpoints.
- Continuam pendentes somente a validação física em Safari iPhone, Chrome Android e 1024 × 768 com `pointer: coarse` real.

## Correção do hero mobile — réplica da mecânica de referência — 11 de setembro de 2026

### Retificação da tentativa anterior

A primeira correção compacta adicionou duas névoas artificiais, atrasou a criação do `ScrollTrigger` até o fim da animação de entrada e substituiu a dobra final por uma translação opaca. O resultado não correspondia à referência: “AMAZÔNIA” podia desaparecer e o Lenis ficava dessincronizado quando o usuário começava a rolar durante a entrada. Essa implementação foi removida.

### Mecânica confirmada na referência

A inspeção do hero da White Desert em `390 × 844` mostrou uma composição mais simples:

- o contêiner da cena mede `200vh`;
- o quadro interno de `100vh` permanece pinado por todo o contêiner, com `pinSpacing: false`;
- o título nunca anima `opacity`: percorre `0 → -60svh` e `blur(0 → 10px)`;
- as duas camadas de nuvem percorrem, simultaneamente, `100% → -80%` e `100% → -10%`;
- o plano de transição parte de `rotateX(90deg)` e chega a `rotateX(0deg)`, iniciando em `40%` da timeline e durando `35%` dela.

Em metade do percurso (`scrollY = 844`), a referência apresentava título em `opacity: 1` e `blur(5px)`, primeira camada em `10%`, segunda em `45%` e dobra em aproximadamente `64.3deg`.

### Implementação aplicada

- A timeline compacta agora usa diretamente a mesma duração, pinagem e progressões da referência e da timeline wide existente no projeto.
- A timeline é criada assim que Lenis está pronto; não existe mais uma animação de entrada bloqueando o registro do `ScrollTrigger`.
- As névoas extras foram excluídas. Permanecem somente os dois recortes de floresta existentes e o plano de transição em perspectiva.
- Os recortes zeram explicitamente o componente `y` antes de animar `yPercent`, evitando a soma com o `translateY(100%)` do CSS.
- “AMAZÔNIA” mantém `opacity: 1`; seu desaparecimento visual acontece por deslocamento, blur e oclusão pelas camadas superiores.
- O título conserva a correção de centralização: largura intrínseca, `left: 50%` e um único `translateX(-50%)`.

### Revalidação

| Viewport | Resultado | Evidência principal |
|---|---|---|
| 375 × 812 | Aprovado | Título visível no carregamento, margens geométricas idênticas de `33.05px`, hero com `1624px` (`200vh`) e nenhum overflow horizontal. |
| 390 × 844 | Aprovado | Margens de `34.48px` e `34.26px`. Em `scrollY = 844`, os valores de título, florestas e dobra coincidem com a referência; `scrollWidth = clientWidth = 390`. |
| 390 × 844, retorno | Aprovado | Ao inverter o scroll, título retorna a `blur(0px)` e `opacity: 1`; as duas florestas retornam a `100%`, sem salto ou travamento. |

O encerramento libera o hero e apresenta Fôlego normalmente. `npm run lint` e `npm run build` também foram concluídos sem erro de projeto. A validação em navegador registrou apenas interferências de uma extensão instalada no Chrome, sem erro de runtime originado pela aplicação.

### Status

- **P1 centralização de “AMAZÔNIA”: encerrado** nos viewports de telefone revalidados.
- **P1 réplica da transição do hero: encerrado** no escopo visual assistido.
- Permanece pendente a validação física em Safari iPhone e Chrome Android.

## Fontes

[^1]: [White Desert — site de referência](https://white-desert.com/), inspeção visual de desktop e mobile em 10 de setembro de 2026.
[^2]: [Bundle público da seção horizontal da White Desert](https://white-desert.com/_next/static/chunks/3740e28aac5f04a8.js?dpl=dpl_BS2Haf5GVN1XeZSdPH93Mi3PFBeo), inspecionado em 10 de setembro de 2026. Bundle minificado e vinculado ao deploy atual; o URL pode mudar em publicação futura.
[^3]: [Bundle público do provider Lenis da White Desert](https://white-desert.com/_next/static/chunks/d2e25e0992870da6.js?dpl=dpl_BS2Haf5GVN1XeZSdPH93Mi3PFBeo), inspecionado em 10 de setembro de 2026.
[^4]: [Lenis — documentação e integração oficial](https://github.com/darkroomengineering/lenis), incluindo integração GSAP, opções touch e limitações de plataforma.
[^5]: [GSAP ScrollTrigger.normalizeScroll()](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll%28%29/), documentação oficial.
[^6]: [GSAP ScrollTrigger.config()](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.config%28%29/), documentação oficial de `ignoreMobileResize`.
[^7]: [GSAP gsap.matchMedia()](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/), documentação oficial sobre condições responsivas e cleanup.
[^8]: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), documentação oficial sobre pinning, scrub, horizontal scroll e `containerAnimation`.

Fontes locais principais: `site/hooks/use-motion-profile.ts`, `site/components/smooth-scroll/smooth-scroll.tsx`, componentes de Hero, Veias, Fauna, Territórios, Mapa, Arara e Epílogo, `site/app/page.module.scss` e documentos `docs/01`, `docs/05`, `docs/06`, `docs/09` e `docs/10`, todos inspecionados no working tree atual.
