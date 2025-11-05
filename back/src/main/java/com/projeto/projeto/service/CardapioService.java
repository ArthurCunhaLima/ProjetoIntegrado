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

    public Cardapio criarCardapio(String nomeEstabelecimento, String hexFundo, String hexTexto,List<Item> listaItem){
        Cardapio novoCardapio = new Cardapio(nomeEstabelecimento,hexFundo,hexTexto,listaItem);
        return cardapioRepository.save(novoCardapio);
    }
}
