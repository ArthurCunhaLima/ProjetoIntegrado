package service;


import repository.ItemRepository;
import model.Item;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {
    private final ItemRepository itemRepository;

    public ItemService (ItemRepository itemRepository){
        this.itemRepository = itemRepository;
    }

    public Item adicionarItem(String nome,float valor){
        Item itemAdicionar = new Item();
        itemAdicionar.setNome(nome);
        itemAdicionar.setValor(valor);
        return itemRepository.save(itemAdicionar);
    }

    public List<Item> retornarItem(){
        return itemRepository.findAll();
    }

}
