    package com.projeto.projeto.controller;


    import com.projeto.projeto.model.Cardapio;
    import com.projeto.projeto.model.Item;
    import com.projeto.projeto.service.CardapioService;
    import com.projeto.projeto.service.ItemService;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    @RestController

    @CrossOrigin(origins = "*")
    @RequestMapping("/creator")
    public class CreatorController {
        private final ItemService itemService;
        private final CardapioService cardapioService;

        public CreatorController(ItemService itemService, CardapioService cardapioService){
            this.itemService = itemService;
            this.cardapioService = cardapioService;
        }
        @PostMapping("/gerarCardapio")
        public Cardapio criarCardapio(@RequestBody Cardapio cardapio) {
            return cardapioService.criarCardapio(cardapio);
        }
        @DeleteMapping("/item/remover/{nome}")
        public ResponseEntity<?> removerItem(@PathVariable String nome) {
            Item removido = itemService.removerItem(nome);

            if (removido == null) {
                return ResponseEntity.status(404).body("Item não encontrado");
            }

            return ResponseEntity.ok("Item removido com sucesso");
        }



    }
