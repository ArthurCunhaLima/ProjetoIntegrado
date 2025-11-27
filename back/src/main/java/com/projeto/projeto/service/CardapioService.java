package com.projeto.projeto.service;

import com.projeto.projeto.model.Cardapio;
import com.projeto.projeto.model.Item;
import com.projeto.projeto.repository.CardapioRepository;
import com.projeto.projeto.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class CardapioService {
    private final CardapioRepository cardapioRepository;

    public CardapioService(CardapioRepository cardapioRepository,ItemRepository itemRepository) {
        this.cardapioRepository = cardapioRepository;
    }

    public Cardapio criarCardapio(Cardapio cardapio){
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
    public List<String> getAllNomesEstabelecimento(){
        return cardapioRepository.findAllNomesEstabelecimento();
    }

}

