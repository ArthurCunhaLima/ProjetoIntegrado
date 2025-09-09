package model.entity;


import jakarta.persistence.Entity;

@Entity
public class PesquisaEntity {
    public String url;
    public String image;


    public String getUrl(){
        return this.url;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String urlImage){
        this.image = urlImage;
    }


}
