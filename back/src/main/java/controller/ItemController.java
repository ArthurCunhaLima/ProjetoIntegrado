package controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import repository.model.Item;
import service.ItemService;

import java.util.List;

@RestController
public class ItemController {
    private final ItemService itemService;


    public ItemController(ItemService itemService){
        this.itemService = itemService;
    }

    @GetMapping("/GET")
    public List<Item> retornarItens(){
        return itemService.retornarItem();
    }

    @PostMapping("/POST")
    public Item adicionarItem(@RequestBody String nome, float valor){
        return itemService.adicionarItem(nome,valor);
    }

}
