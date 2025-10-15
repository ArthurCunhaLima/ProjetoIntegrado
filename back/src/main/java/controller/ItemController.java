package controller;


import org.springframework.web.bind.annotation.*;
import model.Item;
import service.ItemService;

import java.util.List;

@RestController
@RequestMapping("/itens")
public class ItemController {
    private final ItemService itemService;


    public ItemController(ItemService itemService){
        this.itemService = itemService;
    }

    @GetMapping("/retornar")
    public List<Item> retornarItens(){
        return itemService.retornarItem();
    }

    @PostMapping("/adicionar")
    public Item adicionarItem(@RequestBody Item item){
        return itemService.adicionarItem(item.getNome(),item.getValor());
    }

}
