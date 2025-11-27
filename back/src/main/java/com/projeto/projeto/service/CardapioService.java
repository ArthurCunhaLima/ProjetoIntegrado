package com.projeto.projeto.service;

import com.projeto.projeto.dto.CardapioResponseDTO;
import com.projeto.projeto.model.Cardapio;
import com.projeto.projeto.model.Item;
import com.projeto.projeto.repository.CardapioRepository;
import com.projeto.projeto.repository.ItemRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;


@Service
public class CardapioService {
    private final CardapioRepository cardapioRepository;
    private final QRCodeService qrCodeService;

    @Value("${server.servlet.context-path:}")
    private String contextPath;

    public CardapioService(CardapioRepository cardapioRepository, ItemRepository itemRepository, QRCodeService qrCodeService) {
        this.cardapioRepository = cardapioRepository;
        this.qrCodeService = qrCodeService;
    }

    public CardapioResponseDTO criarCardapio(Cardapio cardapio, HttpServletRequest request) throws Exception {
        Cardapio novoCardapio = new Cardapio(cardapio.getNomeEstabelecimento()
                , cardapio.getHexFundo(),
                cardapio.getHexTexto(),
                cardapio.getItensCardapio());
        Cardapio cardapioSalvo = cardapioRepository.save(novoCardapio);
        
        // Gerar URL do cardápio de forma dinâmica
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        String contextPath = request.getContextPath();
        
        String baseUrl = scheme + "://" + serverName;
        if ((scheme.equals("http") && serverPort != 80) || (scheme.equals("https") && serverPort != 443)) {
            baseUrl += ":" + serverPort;
        }
        
        String nomeFormatado = cardapioSalvo.getNomeEstabelecimento().replace(" ", "-");
        String cardapioUrl = baseUrl + contextPath + "/pages/cardapio/" + nomeFormatado;
        
        // Gerar QR Code
        String qrCodeDataUrl = qrCodeService.gerarQRCodeDataUrl(cardapioUrl, 300, 300);
        
        return new CardapioResponseDTO(cardapioSalvo, qrCodeDataUrl, cardapioUrl);
    }

    public Cardapio criarCardapioSimples(Cardapio cardapio){
        Cardapio novoCardapio = new Cardapio(cardapio.getNomeEstabelecimento()
                ,cardapio.getHexFundo(),
                cardapio.getHexTexto(),
                cardapio.getItensCardapio());
        return cardapioRepository.save(novoCardapio);
    }

    public List<Cardapio> retornar(){
        return cardapioRepository.findAll();
    }

    public Cardapio buscarPorNome(String nomeEstabelecimento){
        return cardapioRepository.findByNomeEstabelecimento(nomeEstabelecimento);
    }

    public Cardapio obterCardapioPeloNomeUrl(String nomeCardapioUrl) {
        String nomeFormatado = nomeCardapioUrl.replace("-", " ");
        return cardapioRepository.findByNomeEstabelecimento(nomeFormatado);
    }
}

