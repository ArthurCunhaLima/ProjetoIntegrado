package com.projeto.projeto.service;


import com.projeto.projeto.repository.ItemRepository;
import com.projeto.projeto.model.Item;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {
    private final ItemRepository itemRepository;

    public ItemService (ItemRepository itemRepository){
        this.itemRepository = itemRepository;
    }

    public Item adicionarItem(String nome,float valor){
        Item itemAdicionar = new Item(nome,valor);
        return itemRepository.save(itemAdicionar);
    }

    public List<Item> retornarItens(){
        return itemRepository.findAll();
    }

}
