import { Link } from 'react-router-dom';

function Privacy() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Política de Privacidade e Termos de Uso</h1>

        <div className="space-y-6 text-gray-600">
          <p className="italic">
            Ao utilizar nossos serviços, você concorda com a política de privacidade e os termos e condições aqui contidos.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Política de Privacidade</h2>
            <p>
              O serviço fornecido por nós não envia seu arquivo para nosso servidor. Todo o processamento é feito localmente em seu navegador. 
              Não há absolutamente nenhuma preocupação com privacidade para seus arquivos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Política de Cookies</h2>
            <p>
              Cookies são usados neste site para armazenar informações do Google para seus anúncios e análises. 
              text-file-splitter.felixbr.org não armazena nenhum cookie para seu próprio uso.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Análise de Usuário Anônimo</h2>
            <p>
              O Google Analytics e o Microsoft Clarity são usados ​​para coletar dados anônimos de uso do site. 
              Isso não inclui nenhum dado dos seus arquivos. Não há absolutamente nenhuma preocupação com a privacidade dos seus arquivos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Termos de Serviço</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Sem garantias</h3>
                <p>
                  Quaisquer serviços fornecidos neste site são fornecidos "como estão", sem garantia de qualquer tipo. 
                  Não garantimos sua disponibilidade, precisão, integridade ou a disponibilidade de suporte relacionado a eles. 
                  Podemos adicionar, remover ou alterar os serviços fornecidos sem aviso prévio.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Limitação da nossa responsabilidade</h3>
                <p>
                  O uso deste site é por sua conta e risco. Sob nenhuma circunstância o text-file-splitter.felixbr.org 
                  ou qualquer outra parte envolvida na produção do conteúdo ou serviços deste site será responsável 
                  perante você ou qualquer outra pessoa por quaisquer danos indiretos, diretos, especiais, incidentais 
                  ou consequentes decorrentes do seu acesso ou uso deste site.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;