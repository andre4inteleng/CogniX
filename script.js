// ============================================================
// VARIÁVEIS GERAIS
// ============================================================

let faixaAtual = null;
let questoes = [];
let indice = 0;
let selecionada = null;
let acertos = 0;
let stats = {};

const $ = id => document.getElementById(id);


// ============================================================
// NOMES DOS NÍVEIS
// ============================================================

const nomesNiveis = {

    "5-10": "Iniciantes — Nível 1",

    "11-15": "Médio — Nível 2",

    "16-22": "Avançado — Nível 3",

    "23+": "Expert — Nível 4"

};


// ============================================================
// DESCRIÇÕES DAS HABILIDADES
// ============================================================

const mensagensCategorias = {

    "Numérico":
        "Neste teste, você demonstrou facilidade com números, cálculos e relações matemáticas.",

    "Lógica":
        "Neste teste, você demonstrou facilidade para analisar informações, estabelecer relações e chegar a conclusões lógicas.",

    "Sequências":
        "Neste teste, você demonstrou facilidade para identificar sequências e prever corretamente seus próximos elementos.",

    "Espacial":
        "Neste teste, você demonstrou facilidade para visualizar posições, formas e transformações espaciais.",

    "Analogias":
        "Neste teste, você demonstrou facilidade para identificar relações e semelhanças entre diferentes conceitos.",

    "Classificação":
        "Neste teste, você demonstrou facilidade para identificar características em comum e distinguir elementos de diferentes grupos.",

    "Padrões":
        "Neste teste, você demonstrou facilidade para reconhecer estruturas, regularidades e padrões recorrentes.",

    "Visual":
        "Neste teste, você demonstrou facilidade para interpretar formas e informações visuais."

};


// ============================================================
// MENSAGEM DE ACORDO COM O DESEMPENHO
// ============================================================

function mensagemResultado(percentual) {

    if (percentual >= 90) {

        return "Excelente desempenho! Você demonstrou muita facilidade nos desafios deste nível.";

    }

    if (percentual >= 75) {

        return "Ótimo desempenho! Você resolveu com facilidade a maior parte dos desafios deste nível.";

    }

    if (percentual >= 60) {

        return "Bom desempenho! Você apresentou um bom resultado e conseguiu resolver boa parte dos desafios.";

    }

    if (percentual >= 40) {

        return "Desempenho intermediário. Você conseguiu superar vários desafios, mas ainda há espaço para evoluir.";

    }

    return "Este nível apresentou desafios importantes. Continue praticando e tente novamente!";

}


// ============================================================
// CONTROLE DAS TELAS
// ============================================================

function tela(id) {

    document
        .querySelectorAll('.tela')
        .forEach(x =>
            x.classList.remove('ativa')
        );

    $(id).classList.add('ativa');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}


// ============================================================
// SELEÇÃO DO NÍVEL
// ============================================================

document
    .querySelectorAll('.idade')
    .forEach(btn =>

        btn.addEventListener(
            'click',
            () => iniciar(btn.dataset.faixa)
        )

    );


// ============================================================
// INICIAR TESTE
// ============================================================

function iniciar(faixa) {

    faixaAtual = faixa;

    questoes = [
        ...bancoPerguntas[faixa]
    ];

    indice = 0;

    selecionada = null;

    acertos = 0;

    stats = {};

    tela('teste');

    mostrar();

}


// ============================================================
// MOSTRAR QUESTÃO
// ============================================================

function mostrar() {

    const q = questoes[indice];


    // Contador

    $('contador').textContent =
        `Questão ${indice + 1} de ${questoes.length}`;


    // Barra de progresso

    $('progresso').style.width =
        `${((indice + 1) / questoes.length) * 100}%`;


    // Categoria

    $('categoria').textContent =
        q[3];


    // Pergunta

    $('pergunta').textContent =
        q[0];


    // Limpa alternativas

    $('alternativas').innerHTML = '';

    selecionada = null;

    $('proxima').disabled = true;


    // Cria alternativas

    q[1].forEach((texto, i) => {

        const b =
            document.createElement('button');

        b.className =
            'alternativa';

        b.textContent =
            `${String.fromCharCode(65 + i)}. ${texto}`;


        b.onclick = () => {

            document
                .querySelectorAll('.alternativa')
                .forEach(x =>
                    x.classList.remove('selecionada')
                );


            b.classList.add(
                'selecionada'
            );


            selecionada = i;


            $('proxima').disabled =
                false;

        };


        $('alternativas')
            .appendChild(b);

    });


    // Texto do botão

    $('proxima').textContent =

        indice === questoes.length - 1

            ? 'Ver resultado'

            : 'Próxima';

}


// ============================================================
// PRÓXIMA QUESTÃO
// ============================================================

$('proxima').onclick = () => {

    if (selecionada === null) {

        return;

    }


    const q =
        questoes[indice];


    const cat =
        q[3];


    // Cria estatística da categoria

    if (!stats[cat]) {

        stats[cat] = {

            ok: 0,

            total: 0

        };

    }


    stats[cat].total++;


    // Verifica resposta

    if (selecionada === q[2]) {

        acertos++;

        stats[cat].ok++;

    }


    indice++;


    // Próxima questão ou resultado

    if (indice < questoes.length) {

        mostrar();

    }

    else {

        resultado();

    }

};


// ============================================================
// RESULTADO
// ============================================================

function resultado() {

    const pct =
        Math.round(
            acertos /
            questoes.length *
            100
        );


    // ========================================================
    // NÍVEL REALIZADO
    // ========================================================

    $('nivelResultado').textContent =
        `Nível realizado: ${nomesNiveis[faixaAtual]}`;


    // ========================================================
    // RESULTADO GERAL
    // ========================================================

    $('percentual').textContent =
        `${pct}%`;


    $('acertos').textContent =
        `${acertos} de ${questoes.length} acertos`;


    $('mensagem').textContent =
        mensagemResultado(pct);


    // ========================================================
    // RESULTADOS POR CATEGORIA
    // ========================================================

    const box =
        $('categoriasResultado');


    box.innerHTML = '';


    let melhorPercentual = -1;

    let melhoresCategorias = [];


    Object
        .entries(stats)
        .forEach(([cat, s]) => {


            const p =
                Math.round(
                    s.ok /
                    s.total *
                    100
                );


            // ================================================
            // VERIFICA MELHOR CATEGORIA
            // ================================================

            if (p > melhorPercentual) {

                melhorPercentual =
                    p;

                melhoresCategorias =
                    [cat];

            }

            else if (
                p === melhorPercentual
            ) {

                melhoresCategorias
                    .push(cat);

            }


            // ================================================
            // BARRA DA CATEGORIA
            // ================================================

            box.innerHTML += `

                <div class="linha-cat">

                    <span>
                        ${cat}
                    </span>

                    <span>
                        ${p}%
                    </span>

                    <div class="mini-barra">

                        <div
                            style="width:${p}%">
                        </div>

                    </div>

                </div>

            `;

        });


    // ========================================================
    // DESTAQUE COGNITIVO
    // ========================================================

    if (
        melhoresCategorias.length === 1
    ) {

        const melhor =
            melhoresCategorias[0];


        $('destaqueTitulo').textContent =
            melhor;


        $('destaqueTexto').textContent =

            mensagensCategorias[melhor]

            ||

            "Esta foi a categoria em que você apresentou seu melhor desempenho.";

    }

    else {

        $('destaqueTitulo').textContent =
            melhoresCategorias.join(" + ");


        $('destaqueTexto').textContent =
            "Você apresentou seu melhor desempenho nestas categorias, indicando um resultado equilibrado entre diferentes tipos de raciocínio.";

    }


    // Mostra resultado

    tela('resultado');

}


// ============================================================
// REINICIAR
// ============================================================

$('reiniciar').onclick = () => {

    tela('inicio');

};


// ============================================================
// VOLTAR / SAIR DO TESTE
// ============================================================

$('voltar').onclick = () => {

    if (

        confirm(
            'Deseja sair do teste? O progresso atual será perdido.'
        )

    ) {

        tela('inicio');

    }

};
